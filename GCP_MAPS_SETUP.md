# Google Maps Setup Instructions

## Overview
The `/map` page now uses Google Maps Platform to display an interactive map with property markers.

## GCP Project Setup
✅ **Project Created**: `happyeveryday-maps-2025`
- Project ID: happyeveryday-maps-2025
- Project Name: Happy Everyday Maps
- APIs Enabled: Maps Backend, Maps Embed Backend

## Setup Steps

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Select Project**: `happyeveryday-maps-2025` (already created)
3. Enable the following APIs:
   - ✅ Maps JavaScript API (maps-backend.googleapis.com)
   - ✅ Maps Embed API (maps-embed-backend.googleapis.com)
   - Geocoding API (optional, for address lookup)
   - Places API (optional, for enhanced location data)

4. Create an API key:
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

5. Restrict your API key (recommended):
   - Click on your API key
   - Under "Application restrictions", select "HTTP referrers (web sites)"
   - Add your domain (e.g., `frontend-*.vercel.app/*`)
   - Under "API restrictions", select "Restrict key" and choose the enabled APIs

### 2. Add API Key to Your Application

#### Option A: Environment Variable (Recommended for Production)
1. Create a `.env.local` file in the `frontend` directory:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```

2. Update `frontend/app/map/page.tsx` line 44:
   ```typescript
   script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap`;
   ```

3. Add to Vercel:
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` with your API key
   - Redeploy

#### Option B: Direct Replacement (Quick Test)
Replace `YOUR_GOOGLE_MAPS_API_KEY` in `frontend/app/map/page.tsx` (line 44) with your actual API key.

**⚠️ Warning:** Don't commit your API key to Git if using this method!

### 3. Verify Setup

1. Navigate to `/map` page
2. You should see an interactive Google Map centered on Yankton, SD
3. Click the property marker to see details
4. Click "View Full Report" to go to the analysis page

## Features

- Interactive Google Maps with custom marker
- Property info window on marker click
- Direct link to comprehensive property report
- Responsive sidebar with property details
- AI Route Optimizer placeholder
- Real-time market insights

## Troubleshooting

### Map not loading?
- Check browser console for errors
- Verify API key is correct
- Ensure Maps JavaScript API is enabled in GCP
- Check API key restrictions aren't too strict

### Marker not showing?
- Verify coordinates: lat: 42.8711, lng: -97.3968
- Check console for JavaScript errors

### API Key exposed?
- Use environment variables instead of hardcoding
- Add API key restrictions in GCP Console
- Never commit `.env.local` to Git (already in `.gitignore`)

## Cost Considerations

Google Maps Platform offers:
- $200 free credit per month
- Pay-as-you-go pricing after free tier
- Maps JavaScript API: $7 per 1,000 loads (after free tier)
- First 28,000 loads per month are free

For a single-property site with moderate traffic, you'll likely stay within the free tier.

## Alternative: Mapbox

If you prefer Mapbox instead:
1. Get API token from [Mapbox](https://www.mapbox.com/)
2. Use `react-map-gl` library
3. Replace Google Maps code in `frontend/app/map/page.tsx`

## Support

For issues with Google Maps Platform:
- [Documentation](https://developers.google.com/maps/documentation)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-maps)
- [GCP Support](https://cloud.google.com/support)

