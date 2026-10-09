# Sign Language for Numbers (Kaggle)

Offline-training data only. Not bundled into the app (outside `public/` and `src/`, so Vite/Capacitor never ship it).

- **Source:** Kaggle "Sign Language for Numbers" — URL: TODO (confirm)
- **License:** TODO (confirm redistribution is allowed before merging)
- **Contents:** 16,500 small grayscale JPEGs (~100x161), folders `0`-`9` plus `unknown`, 1,500 images each. Files named like `zero_1.jpg`.
- **`unknown`:** images that are not a digit sign (negative class).
- **Caveat:** looks like ASL, not FSL (e.g. 0 is an O shape; 6, 7, 9 match ASL). Not verified by an FSL signer. Use only to test the training pipeline.
- **Stills only:** no use for moving signs.
