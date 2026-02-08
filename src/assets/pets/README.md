# Pet GIFs Guide

This folder contains the GIF images for your pet companions in the PetSystem.

## Required GIF Files

Add the following GIF files to this folder (`src/assets/pets/`):

| Pet Name          | File Name       | Required |
| ----------------- | --------------- | -------- |
| Bean Green Rick   | `magicpet.gif`  | ✓        |
| Byte The Wizard   | `magicpet2.gif` | ✓        |
| Harry Hooter      | `magicpet4.gif` | ✓        |
| Sourcerer Octocat | `magicpet3.gif` | ✓        |
| Spirit Fox        | `fox.gif`       | ✓        |
| Crystal Unicorn   | `unicorn.gif`   | ✓        |

## GIF Requirements

- **Format**: GIF (animated or static)
- **Recommended Size**: 256x256 pixels or smaller for best performance
- **Transparency**: PNG/GIF with transparency is preferred for a cleaner look
- **File Naming**: Must match exactly as shown in the table above (lowercase, with `.gif` extension)

## Fallback Behavior

If a GIF file is not found or fails to load, the component will automatically display the emoji fallback:

- Dragon: 🐉
- Phoenix: 🔥
- Owl: 🦉
- Cat: 🐱
- Fox: 🦊
- Unicorn: 🦄

## How to Add GIFs

1. Place your GIF files in this directory: `src/assets/pets/`
2. Use the exact filenames listed above
3. The component will automatically load and display them
4. If a GIF fails to load, it will fall back to the emoji

## Image Display Sizes

- **Pet Selection Screen**: 96x96 pixels (h-24 w-24 in Tailwind)
- **Pet Dashboard**: 128x128 pixels (h-32 w-32 in Tailwind)

You can adjust these sizes in `PetSystem.tsx` by modifying the `className` attribute in the image tags (e.g., change `h-24 w-24` to a different size).

## Customization Tips

- For better visual quality, consider using GIFs with transparent backgrounds
- Animated GIFs will loop automatically in the component
- Make sure GIFs are optimized for web to reduce load time
- Test your GIFs in the application to ensure they display correctly
