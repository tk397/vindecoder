# VIN Decoder Web Tool

This is a simple, serverless web tool to decode a 17-character Vehicle Identification Number (VIN). It uses the free [NHTSA vPIC API](https://vpic.nhtsa.dot.gov/api/) to fetch vehicle data and display it.

This project is built with plain HTML, CSS, and JavaScript and is designed to be deployed as a static site on platforms like **Cloudflare Pages**.

## Features

-   **VIN Validation**: Basic client-side check for 17 characters (excluding I, O, and Q).
-   **API Integration**: Fetches comprehensive data from the NHTSA `DecodeVinExtended` endpoint.
-   **Clean UI**: Simple, responsive interface to enter a VIN and view results.
-   **Error Handling**: Displays clear error messages from the API or for invalid input.
-   **Zero Dependencies**: No frameworks, no build step. Just static files.

## VIN Structure (Based on Wikipedia)

A VIN is a 17-character code with three main sections:

1.  **WMI (World Manufacturer Identifier)**: Positions 1-3. Identifies the manufacturer.
2.  **VDS (Vehicle Descriptor Section)**: Positions 4-9. Provides details about the vehicle, such as model and body type. Position 9 is often a check digit.
3.  **VIS (Vehicle Identifier Section)**: Positions 10-17. The unique serial number for the vehicle. Position 10 is used to encode the model year.

## Deployment to Cloudflare Pages

This repository is ready to be deployed directly to Cloudflare Pages.

### Step 1: Create a GitHub Repository

1.  Create a new repository on [GitHub](https://github.com/new).
2.  Name it `vin-decoder` (or any name you like).
3.  Push these files (`index.html`, `style.css`, `script.js`, `README.md`) to your new repository.

### Step 2: Deploy with Cloudflare Pages

1.  Log in to your [Cloudflare dashboard](https://dash.cloudflare.com/).
2.  Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3.  Select the GitHub repository you just created.
4.  In the "Set up builds and deployments" section, you can leave all settings as default. Cloudflare Pages is smart enough to detect that this is a static site with no build step.
    -   **Framework preset**: Select `None`.
    -   **Build command**: (Leave blank)
    -   **Build output directory**: (Leave blank or set to `/`)
5.  Click **Save and Deploy**.

That's it! Your site will be live on a `.pages.dev` subdomain in about a minute.