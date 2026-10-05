# Cartoon art slots: drop-in manifest

The homepage has labelled cartoon slots in every section. Generate or drop a PNG at these exact filenames and it appears with no code change. Until a file exists, the slot shows a small dashed circle labelled with the slot name; the `<img>` removes itself on a failed load, so there are never broken-image icons.

## What to generate

Hand-drawn / cartoon style, plants and farm animals, warm palette (moss green, terracotta, straw, cream) to sit on the paper background. Transparent background PNGs preferred. Any square-ish size works (the slot uses `object-fit: contain`).

## The slots

| File | Section | Subject suggestion |
|---|---|---|
| `assets/farm/hero-field.jpg` | Hero plate | Your real farm photo (photo, not cartoon) |
| `assets/farm/viking-farms-logo-clean.png` | Farm section seal | The real Viking Farms logo, background removed, tinted to the site's root-brown ink. REPLACED by dropping a new transparent PNG at this filename. |
| `assets/farm/viking-farms-logo-cream.png` | Footer seal | The cream-toned version for the dark footer. Same swap rule. |
| `assets/farm/viking-farms-logo.png` | (source, unused by the page) | The original magenta-on-cream file, kept as the processing source |
| `assets/art/why.png` | Method 01 | A young sprout in a fistful of soil |
| `assets/art/soil.png` | Method 02 | A smiling worm with soil layers |
| `assets/art/compost.png` | Method 03 | A compost pile with steam and rice straw |
| `assets/art/tilling.png` | Method 04 | A carabao resting beside an unplowed field |
| `assets/art/cover.png` | Method 05 | Cover crops between crop rows |
| `assets/art/pests.png` | Method 06 | A ladybug and a friendly bee over vegetables |
| `assets/art/water.png` | Method 07 | Rain clouds over a rice paddy |
| `assets/art/firstseason.png` | Method 08 | A farmer planting seedlings in a row |
| `assets/art/pay.png` | Method 09 | A market stall with fruit and vegetables |
| `assets/art/measure.png` | Method 10 | A tape measure around a thriving tree |
| `assets/art/curious.png` | Who It's For 1 | A farmer looking at a dragonfruit vine, thinking |
| `assets/art/starter.png` | Who It's For 2 | A farmer with a shovel and a seedling tray |
| `assets/art/steward.png` | Who It's For 3 | A farmer standing in a lush regenerative field |
| `assets/art/farm-dragonfruit.png` | The Farm: main crop | Dragonfruit on its trellis, bright magenta fruit |
| `assets/art/farm-rice.png` | The Farm: the classics | Rice stalks and sugarcane bundle |
| `assets/art/farm-animals.png` | The Farm: the animals | Chickens and a goat beside a compost bin |
| `assets/art/farm-community.png` | The Farm: community | Farmers gathered under a barangay hall |

Total: 1 photo slot + 17 cartoon slots. JPG works too for any slot; the file just has to match the name in the `<img src>`.
