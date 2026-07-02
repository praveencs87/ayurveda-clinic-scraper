# Ayurveda Clinic Lead Finder

**Extract highly specialized B2B leads for Ayurveda doctors, wellness clinics, and herbal practitioners directly from major health directories like Practo.**

The alternative medicine and wellness market is booming. If you sell herbal supplements, clinic management SaaS, or medical equipment, building a targeted list of Ayurveda practitioners is essential. This actor completely automates the process of extracting verified Ayurvedic clinics and doctors from top health directories.

## What can this Actor do?

- ✅ **Clinic & Doctor Names** - Extracts the name of the practicing doctor or the wellness clinic.
- ✅ **Location Data** - Grabs the specific city and locality/neighborhood of the clinic so you can map out regional density.
- ✅ **Reputation & Pricing** - Extracts patient satisfaction ratings, recommendation percentages, and standard consultation fees.
- ✅ **High Speed** - Bypasses directory bot protections using advanced TLS fingerprinting (`got-scraping`).

*(Note: Major health directories mask actual phone numbers behind proxy buttons or logins. To bypass this, this actor provides the exact profile URL and locality, allowing your B2B sales teams to instantly match the clinic in their CRM or via a quick Google Maps search).*

## Why use this Actor?

- 🎯 **B2B Lead Generation** - Sell wholesale herbal medicines, supplements, or medical equipment directly to active clinics.
- 🤝 **SaaS Sales** - Pitch your clinic management software to verified doctors.
- 📊 **Market Analysis** - Analyze which cities have the highest density of highly-rated Ayurvedic practitioners and their average consultation fees.

## How to use it

1. Go to Practo (or a similar supported directory) and search for "Ayurveda" in your target city.
2. Copy the URL from your browser (e.g., `https://www.practo.com/delhi/ayurveda`) and paste it into the **Directory URLs** field.
3. Set the **Max Leads to Extract** limit (default is 500).
4. Click Start!

## How much does it cost?

This actor uses a **Pay-Per-Event (PPE)** pricing model. You only pay for the exact number of leads successfully extracted!
- **$1.50 per 1,000 clinic leads extracted.**

## Output Example

When a clinic lead is extracted, the actor pushes this data to your dataset:

```json
{
  "name": "Dr. Sharma's Ayurveda Care",
  "locality": "Rohini, Delhi",
  "experience": "15 years experience",
  "rating": "98%",
  "consultationFee": "₹500",
  "profileUrl": "https://www.practo.com/delhi/doctor/dr-sharma-ayurveda",
  "scrapedAt": "2023-10-25T15:00:00.000Z"
}
```
