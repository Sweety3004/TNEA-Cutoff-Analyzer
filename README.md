# TNEA Assessment

This project provides a web-based interface to analyze and compare TNEA (Tamil Nadu Engineering Admissions) cutoff marks.

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Required to run the local development server.
- **Python**: Required for data validation and processing scripts.

### 1. Running the Web Application
To start the application locally, use the provided batch script:

1. Open a terminal (PowerShell or Command Prompt) in the project root.
2. Run the following command:
   ```powershell
   .\launch_app.bat
   ```
3. The application will be available at `http://localhost:3000`.

### 2. Data Validation
If you update the dataset (e.g., `TNEAcourseInsights.json`), you can validate the JSON structure using either Python or Node.js.

- **Using Python**:
  ```powershell
  python validate_json.py
  ```
- **Using Node.js**:
  ```powershell
  node validate_json.js
  ```

### 3. Deployment
To deploy the application to Vercel (Production), run:
```powershell
.\deploy_to_vercel.bat
```
Follow the on-screen prompts to log in and complete the deployment.

---

## 📂 Project Structure
- `TNEA-Assessment/`: Contains the web application source code (`index.html`, etc.).
- `data/`: JSON and CSV files containing TNEA cutoff data and rankings.
- `launch_app.bat`: Helper script to start the local server.
- `deploy_to_vercel.bat`: Helper script for Vercel deployment.
- `validate_json.py` / `validate_json.js`: Utility scripts to ensure data integrity.
