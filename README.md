# Global VIN Decoder Web Tool

This is a simple, serverless web tool to decode a 17-character Vehicle Identification Number (VIN).

This version has been upgraded to use the **API-Ninjas VIN Lookup API** to provide **basic global data** for vehicles from all over the world, not just the United States.

## Features

-   **Global Data**: Uses the API-Ninjas API to decode VINs from 180+ countries.
-   **Core Details**: Returns Manufacturer, Model, Model Year, Country, and Region.
-   **API Key Storage**: Securely saves your API key in your browser's `localStorage` so you don't have to re-paste it.
-   **Error Handling**: Displays clear error messages from the API.
-   **Static Site**: Built with plain HTML, CSS, and JavaScript. Perfect for **Cloudflare Pages**.

## Why Not NHTSA?

The previous version used the free US NHTSA API. That API only contains detailed data for vehicles sold in the United States. It will fail or return minimal data for VINs from Europe, China, or other regions.

## Required Setup: API-Ninjas Key

This tool **requires a free API key** to work.

1.  Go to [api-ninjas.com](https://api-ninjas.com/) and sign up for a free account.
2.  Go to your account dashboard.
3.  Find the "VIN Lookup" API and copy your personal API key.
4.  When you open the `index.html` page, paste this key into the "Your API Key" input field.

The free plan includes **10,000 free requests per month**.

## Deployment to Cloudflare Pages

1.  Push these files (`index.html`, `style.css`, `script.js`, `README.md`) to a new GitHub repository.
2.  Log in to your [Cloudflare dashboard](https://dash.cloudflare.com/).
3.  Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
4.  Select the GitHub repository you just created.
5.  In "Set up builds and deployments," select `None` for the **Framework preset**.
6.  Click **Save and Deploy**.
