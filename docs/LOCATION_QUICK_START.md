# 🗺️ Agency Location Feature - Quick Start Guide

## For Agency Owners

### Setting Your Office Location

#### Method 1: Automatic Detection (Recommended) ⚡

1. **Go to Profile Settings**
   ```
   Navigate to: /agency/profile
   ```

2. **Use Auto-Detection**
   - Click the button: "📍 تحديد موقعي تلقائياً" (Detect my location automatically)
   - Allow location access when prompted by your browser
   - Wait for the map to center on your location (2-5 seconds)

3. **Confirm or Adjust**
   - **If location is correct**: Just save your profile
   - **If location needs adjustment**: Drag the marker to the exact spot
   - The marker is fully draggable for precision

4. **Save Changes**
   - Click "حفظ التغييرات" (Save Changes)
   - Done! Your location is now public

#### Method 2: Manual Selection 🖱️

1. **Go to Profile Settings**
   ```
   Navigate to: /agency/profile
   ```

2. **Find the Map Section**
   - Scroll down to "موقع المكتب على الخريطة" (Office Location on Map)
   - You'll see an interactive map

3. **Select Your Location**
   - **Option A**: Click directly on your office location
   - **Option B**: Click nearby, then drag the marker to the exact spot
   - The map will show your selected coordinates

4. **Verify & Save**
   - Check the coordinates preview below the map
   - Click "حفظ التغييرات" (Save Changes)
   - Done! Your location is now public

### What Happens Next?

- Your location appears on your public agency profile
- Travelers can see where to find you
- The map shows in the sidebar with "Office Location" label
- Increases trust and credibility

---

## For Travelers

### Viewing Agency Location

1. **Visit Agency Profile**
   ```
   Navigate to: /agencies/[agency-slug]
   ```

2. **Find Location Card**
   - Look in the right sidebar
   - Card titled "Office Location"

3. **Interact with Map**
   - Click the marker to see agency name
   - Use zoom controls (+ / -)
   - Drag map to explore surroundings

### If No Location Set

You'll see a message:
```
لم يتم تحديد الموقع
لم تقم الوكالة بتحديد موقعها على الخريطة بعد
```

---

## Technical Details

### Map Features

**Agency Setup (Editable)**:
- Click-to-place marker
- Drag to adjust
- Real-time coordinate preview
- Clear instructions

**Public Profile (View-Only)**:
- Fixed marker at office location
- Zoom/pan controls enabled
- Click marker for popup
- Professional appearance

### Data Storage

```sql
-- Database fields
latitude: DECIMAL(10, 8)   -- e.g., 36.753768
longitude: DECIMAL(11, 8)  -- e.g., 3.058811
```

### Accuracy

- Coordinates stored with 6-8 decimal precision
- Accuracy: ~11cm to 1.1cm at equator
- More than enough for office locations

---

## Examples

### Example Coordinates (Algeria)

| City       | Latitude  | Longitude | Zoom |
|------------|-----------|-----------|------|
| Algiers    | 36.7538   | 3.0588    | 15   |
| Oran       | 35.6969   | -0.6331   | 15   |
| Constantine| 36.3650   | 6.6147    | 15   |
| Annaba     | 36.9000   | 7.7667    | 15   |

### Default Center

If no location set, map centers on:
- **Algeria (Algiers)**: [36.7538, 3.0588]
- **Zoom**: 6 (country-wide view)

---

## Tips for Best Results

### For Agencies

✅ **Do**:
- Set your EXACT office location
- Double-check by zooming in
- Update if you move offices
- Test by visiting your public profile

❌ **Don't**:
- Use approximate locations
- Place marker on landmarks nearby
- Leave coordinates unset
- Set location at city center (unless that's where you are)

### For Travelers

✅ **Do**:
- Use location to plan visits
- Check before traveling to office
- Zoom in to see nearby landmarks
- Screenshot for offline reference

❌ **Don't**:
- Rely solely on map (call to confirm)
- Assume hours from location alone
- Navigate without verifying with agency

---

## Common Scenarios

### Scenario 1: New Agency Setup (Auto-Detect)
```
1. Agency registers → No location set
2. Goes to profile editor
3. Clicks "📍 تحديد موقعي تلقائياً"
4. Browser asks for permission → Allows
5. Map centers on detected location
6. Agency confirms marker is correct
7. Saves profile
8. Location appears on public profile
```

### Scenario 2: New Agency Setup (Manual)
```
1. Agency registers → No location set
2. Goes to profile editor
3. Clicks on office location on map
4. Saves profile
5. Location appears on public profile
```

### Scenario 3: Office Relocation
```
1. Agency moves to new office
2. Goes to profile editor
3. Drags marker to new location
4. Saves changes
5. Public profile updates immediately
```

### Scenario 4: Traveler Planning Visit
```
1. Traveler finds agency
2. Views public profile
3. Sees office location on map
4. Zooms in to check surroundings
5. Plans visit route
```

---

## Keyboard Shortcuts (On Map)

| Key | Action |
|-----|--------|
| `+` | Zoom in |
| `-` | Zoom out |
| `↑↓←→` | Pan map (arrow keys) |

---

## Mobile Support

### Touch Gestures

- **Tap**: Place/select marker (setup mode)
- **Tap & Hold**: Drag marker (setup mode)
- **Pinch**: Zoom in/out
- **Swipe**: Pan map

---

## Troubleshooting

### "Map not loading"
**Solution**: Wait a few seconds, map loads dynamically

### "Marker not visible"
**Solution**: 
1. Marker icons are loaded from CDN
2. Check internet connection
3. Try refreshing the page
4. Default blue marker should appear

### "Auto-detect not working"
**Solution**:
1. Check browser location permission (padlock icon → Location)
2. Ensure GPS/location services enabled on device
3. Try manual selection as fallback

### "Auto-detect shows wrong location"
**Solution**:
1. This is normal - GPS can be off by 10-50 meters
2. Simply drag the marker to the correct position
3. Or click elsewhere on map to move it
4. Then save

### "Permission denied message"
**Solution**:
1. Browser settings → Site permissions → Location
2. Change to "Allow" for your SAFRGO domain
3. Refresh page and try again
4. Or use manual selection

### "Can't place marker"
**Solution**: Make sure you're in profile editor (/agency/profile), not public view

### "Coordinates not saving"
**Solution**: 
1. Check you clicked "حفظ التغييرات"
2. Verify you're logged in as agency owner
3. Refresh page to see if saved

### "Wrong location showing"
**Solution**:
1. Go back to profile editor
2. Drag marker to correct position
3. Save changes again

---

## Support

Need help?
- Check full documentation: `docs/LOCATION_FEATURE.md`
- Review database migration: `scripts/012_add_agency_coordinates.sql`
- Contact support through platform

---

## Quick Links

- **Agency Profile Editor**: `/agency/profile`
- **Public Agency Profile**: `/agencies/[slug]`
- **Leaflet Docs**: https://leafletjs.com/
- **OpenStreetMap**: https://www.openstreetmap.org/

---

## Status: ✅ Production Ready

The location feature is fully implemented and ready to use!
