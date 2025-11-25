# GitHub Codespaces Setup

## Quick Start

This project is configured to run in GitHub Codespaces. To set up:

1. **Open in Codespaces**: 
   - Click the green `<> Code` button on the GitHub repository
   - Select "Codespaces" tab
   - Click "Create codespace on main"

2. **Environment Setup**:
   The `.devcontainer/devcontainer.json` automatically:
   - Installs Node.js 20
   - Installs all npm dependencies
   - Builds the project
   - Forwards ports 5173, 8081, 8082

3. **Run the Development Server**:
   ```bash
   npm run dev
   ```

4. **Access the Application**:
   - Once `npm run dev` is running, click the port forwarding notification
   - Or go to: `http://localhost:8081` (or the assigned port)

## Configuration

The app requires the following environment variable in `.env`:

```env
VITE_SERPAPI_API_KEY=your_serpapi_api_key_here
```

To get a SerpApi key:
1. Visit https://serpapi.com/
2. Sign up for a free account
3. Copy your API key
4. Add it to the Codespaces secrets or `.env` file

## Project Structure

- `src/components/` - React components (KayakSearch, Navbar, etc.)
- `src/services/` - API services (flightAPI, hotelAPI, kayak)
- `src/pages/` - Page components (Dashboard, Explore, PlanTrip, Auth)
- `src/integrations/supabase/` - Supabase database configuration
- `.devcontainer/` - Codespaces configuration

## Troubleshooting

**Port already in use**:
- Vite will automatically try the next available port (8081, 8082)
- Check the terminal output for the actual port being used

**Dependencies not installing**:
- Run `npm install` manually in the terminal
- Or rebuild the devcontainer: `Ctrl+Shift+P` → "Rebuild Container"

**SerpApi errors**:
- Ensure your API key is set in the environment variables
- Check the browser console for specific error messages
