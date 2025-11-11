# Testing Guide for OCR & CSV Import

## Recent Fixes Applied ✅

### 1. **Dark Background with Golden Glow**
- Changed body background from casino green to dark (#0a0a0a to #1a1a1a)
- Added 4 golden radial glows at corners for atmospheric lighting
- Wheel section maintains green felt texture for focus

### 2. **Settings Panel Text Colors**
- All text now uses gold colors (#FFD700 or rgba(255, 215, 0, 0.7/0.8))
- Removed duplicate gray color definition
- Fully readable against dark background

### 3. **Toggle Switches Fixed**
- Added `pointer-events: none` to hide checkbox inputs
- Only custom gold sliders show
- No more visible checkboxes

### 4. **Creator Logo Size Fixed**
- Applied strict constraints: min/max width/height 40px
- Added `object-fit: cover` and `object-position: center`
- Logo contained properly in settings panel

### 5. **Input Form Overflow Fixed**
- Added `width: 100%` and `box-sizing: border-box` to form
- Added `min-width: 0` to input (critical for flex overflow)
- Added `min-width: fit-content` and `flex-shrink: 0` to add-button
- Form no longer overflows container

### 6. **Vertical Scroll Eliminated**
- Added `max-height: calc(100vh - 100px)` to .app-main
- Added `max-height: calc(100vh - 140px)` to .main-content
- Page stays within viewport

---

## How to Test OCR Functionality 📸

### Expected Behavior:
1. **Click "Upload Images (OCR)" button** (dark button with gold border)
2. **Options modal appears** with two checkboxes:
   - "Clear existing wheel items"
   - "Include duplicate items"
3. **Click "Select Images"** button in modal
4. **File picker opens** - select one or more image files (PNG, JPG, etc.)
5. **Processing starts** - button shows "Processing... X%" with spinner
6. **OCR extracts text** from images using Tesseract.js
7. **If duplicates found** (and "Include duplicates" unchecked):
   - Duplicate detection modal appears with 3 buttons:
     - "Add All" - adds everything including duplicates
     - "Add Unique Only" - adds only new items
     - "Add Duplicates Only" - adds only the duplicates
8. **Success modal** shows "Added X item(s) from image!"
9. **Items appear** on the wheel with roulette colors

### Testing Tips:
- Use images with **clear, readable text**
- Try screenshots of lists, menus, or text documents
- Test with single image first, then multiple
- Verify items appear on wheel after processing

### If OCR Doesn't Work:
**Check Console for Errors:**
- Open DevTools (F12)
- Look for Tesseract.js errors
- Check if worker initialization fails

**Verify File Input:**
- Ensure file picker opens when clicking "Select Images"
- Check if files are being read (console.log in handleFileChange)

**Test Button Clickability:**
- Verify button has `z-index: 1` and `position: relative`
- No overlapping elements blocking clicks
- Hover effect works (transform and shadow change)

---

## How to Test CSV Import Functionality 📄

### Expected Behavior:
1. **Click "Import from CSV" button** (green button with gold border)
2. **Options modal appears** with two checkboxes:
   - "Clear existing items from wheel"
   - "Include duplicate items"
3. **Click "Proceed"** button in modal
4. **File picker opens** - select a CSV file
5. **CSV parsing** extracts items (comma or newline separated)
6. **If duplicates found** (and "Include duplicates" unchecked):
   - Same 3-button duplicate detection modal appears
7. **Success modal** shows "Added X item(s) from CSV!"
8. **Items appear** on the wheel

### CSV Format Examples:

**Option 1 - Single Line (Comma-separated):**
```
Apple,Banana,Orange,Grapes,Watermelon
```

**Option 2 - Multiple Lines (One per line):**
```
Pizza
Burger
Tacos
Sushi
Pasta
```

**Option 3 - CSV Table (First column only):**
```
Item,Quantity,Price
Apple,10,1.50
Banana,5,0.75
Orange,8,2.00
```

### Testing Tips:
- Create simple test CSV files with 5-10 items
- Test both comma-separated and newline formats
- Verify duplicate detection works
- Test "Clear existing items" option

### If CSV Import Doesn't Work:
**Check Console for Errors:**
- Look for FileReader errors
- Check CSV parsing errors
- Verify file validation logic

**Verify File Input:**
- Ensure file picker opens when clicking "Proceed"
- Check if .csv files are accepted
- Verify file reading (check FileReader.onload)

**Test Button Clickability:**
- Button has `z-index: 1` and `position: relative`
- No overlapping elements
- Hover effects work

---

## Visual Verification Checklist ✨

- [ ] **Dark Background**: Black gradient with subtle golden glows at corners
- [ ] **Wheel Section**: Green felt texture maintained
- [ ] **Settings Panel**: All text readable in gold colors
- [ ] **Toggle Switches**: Show as sliders (not checkboxes)
- [ ] **Creator Logo**: Contained to 40px circle
- [ ] **Input Form**: No horizontal overflow, add button visible
- [ ] **Page Height**: No vertical scrolling
- [ ] **OCR Button**: Dark with gold border, clickable
- [ ] **CSV Button**: Green with gold border, clickable
- [ ] **Roulette Colors**: Red/Black alternating with green at positions 10 & 21

---

## Known Working Features 🎰

✅ **Casino Theme**: Dark background, gold accents, roulette colors  
✅ **Wheel Spinning**: Animated with tick sounds and win sounds  
✅ **Casino Lever**: Pull-down animation triggers spin  
✅ **Manual Item Entry**: Add items via input form  
✅ **Duplicate Detection**: 3-button modal (All/Unique/Duplicates)  
✅ **Settings Panel**: Sound toggle, spin mode, remove winner option  
✅ **Coin Toss**: Flip animation with heads/tails result  
✅ **Responsive Design**: Works on mobile and desktop  
✅ **Custom Modals**: No browser alerts, all custom casino-styled  

---

## Priority Testing Order 🎯

1. **First**: Test OCR button click → Options modal → File picker opens
2. **Second**: Upload a test image with clear text → Verify items added
3. **Third**: Test CSV button click → Options modal → File picker opens
4. **Fourth**: Import a test CSV file → Verify items added
5. **Fifth**: Test duplicate detection with both OCR and CSV
6. **Finally**: Verify all visual fixes (background, settings, overflow)

---

## If Everything Works 🎉

You should see:
- Dark mysterious casino background with golden edge glow
- Functional OCR that extracts text from images
- Functional CSV import with proper parsing
- Items appearing on roulette wheel with red/black/green colors
- No visual bugs (overflow, scroll, unreadable text)
- Smooth casino experience with sounds and animations

---

## Need Help? 🤔

If OCR or CSV still don't work after testing:
1. **Check browser console** for specific errors
2. **Verify file formats** (clear images for OCR, valid CSV structure)
3. **Test with simple files** first (5-item CSV, screenshot of text list)
4. **Report specific error messages** from console

The code structure is correct - both components are:
- ✅ Properly imported in ItemList.jsx
- ✅ Rendered with onItemsExtracted callbacks
- ✅ Styled with visible buttons (z-index: 1)
- ✅ Wired up to file inputs and modals
- ✅ Using Tesseract.js (OCR) and FileReader (CSV)

If buttons don't trigger anything, it's likely a click event issue or file input not opening.
