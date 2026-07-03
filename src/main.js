import { armKillSwitch, disarmKillSwitch } from './utils/timeoutManager.js';
import { Actor } from 'apify';
import { CheerioCrawler, log } from 'crawlee';

await Actor.init();

try {
    const input = await Actor.getInput();
    if (!input || !input.directoryUrls || input.directoryUrls.length === 0) {
        throw new Error('directoryUrls input is required!');
    }

    const { directoryUrls, maxLeads = 500 } = input;

    let totalLeadsExtracted = 0;

    const crawler = new CheerioCrawler({
        maxConcurrency: 5,
        maxRequestRetries: 3,
        
        async requestHandler({ request, $, log }) {
            const url = request.url;
            log.info(`Scraping Ayurveda Directory: ${url}`);
            
            // Check for bot block
            if ($('title').text().toLowerCase().includes('robot') || $('title').text().toLowerCase().includes('captcha')) {
                throw new Error('Blocked by security check. Retrying with new fingerprint...');
            }

            const cards = $('.listing-doctor-card, .u-p-v--xl, div[data-qa-id="doctor_card"]').toArray();
            let leadsOnPage = 0;

            for (const card of cards) {
                if (totalLeadsExtracted >= maxLeads) break;

                const el = $(card);
                
                // Name & URL
                let name = el.find('h2, [data-qa-id="doctor_name"]').text().trim() || null;
                let profileHref = el.find('a[href*="/doctor/"], a[href*="/clinic/"]').first().attr('href') || null;
                let profileUrl = null;
                if (profileHref) {
                    profileUrl = profileHref.startsWith('http') ? profileHref : `https://www.practo.com${profileHref}`;
                }

                // Locality / Clinic Name
                let locality = el.find('[data-qa-id="doctor_clinic_name"], .u-t-capitalize, .loc-name').text().trim() || null;
                
                // Experience
                let experience = el.find('[data-qa-id="doctor_experience"]').text().trim() || null;
                if (!experience) {
                    const textContent = el.text();
                    const expMatch = textContent.match(/(\d+)\s*years?\s*experience/i);
                    if (expMatch) experience = expMatch[0];
                }

                // Rating & Recommendations
                let rating = el.find('[data-qa-id="doctor_recommendation"], .star-rating, .rating').text().trim() || null;
                
                // Consultation Fee
                let consultationFee = el.find('[data-qa-id="consultation_fee"]').text().trim() || null;
                if (!consultationFee) {
                    const textContent = el.text();
                    const feeMatch = textContent.match(/₹\s*\d+/);
                    if (feeMatch) consultationFee = feeMatch[0];
                }

                if (!name) continue;

                const output = {
                    name,
                    locality,
                    experience,
                    rating,
                    consultationFee,
                    profileUrl,
                    scrapedAt: new Date().toISOString()
                };

                await Actor.pushData(output);
                
                totalLeadsExtracted++;
                leadsOnPage++;
                
                // PPE Monetization
                await Actor.charge({ eventName: 'lead-extracted', count: 1 });
            }

            log.info(`✅ Extracted ${leadsOnPage} Ayurveda clinic leads from this page. Total so far: ${totalLeadsExtracted}`);
            
            // Pagination logic
            if (totalLeadsExtracted < maxLeads) {
                const nextBtn = $('ul.pagination li.active').next().find('a').attr('href') || 
                                $('a[data-qa-id="pagination_next"]').attr('href') || 
                                $('a[rel="next"]').attr('href');
                                
                if (nextBtn) {
                    let nextUrl = nextBtn.startsWith('http') ? nextBtn : new URL(nextBtn, 'https://www.practo.com').href;
                    log.info(`Enqueueing next page: ${nextUrl}`);
                    await crawler.addRequests([nextUrl]);
                }
            }
        },
        
        async failedRequestHandler({ request, log }) {
            log.error(`Failed to scrape ${request.url} after multiple retries.`);
        },
    });

    log.info(`Starting Ayurveda Clinic Lead Finder for ${directoryUrls.length} start URLs...`);
    
    await crawler.addRequests(directoryUrls);
    armKillSwitch(crawler);
    await crawler.run();
    disarmKillSwitch();

    log.info(`🎉 Finished! Extracted ${totalLeadsExtracted} clinic leads.`);
} catch (error) {
    log.error('Actor failed:', error);
    throw error;
}

await Actor.exit();
