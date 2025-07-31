const fs = require("fs");
const path = require("path");

// Files to update with their specific replacements
const filesToUpdate = [
  {
    file: "src/pages/LostItemsPage/Section1.jsx",
    replacements: [
      {
        from: 'const logEndpoint = "http://localhost:8000/api/logs/user-logs";',
        to: 'const logEndpoint = getLogsUrl("USER_LOGS");',
      },
      {
        from: 'const response = await axios.get("http://localhost:8000/api/reports");',
        to: 'const response = await axios.get(getApiUrl("/api/reports"));',
      },
      {
        from: "await axios.delete(`http://localhost:8000/api/reports/${id}`, {",
        to: 'await axios.delete(`${getApiUrl("/api/reports")}/${id}`, {',
      },
      {
        from: '"http://localhost:8000/api/logs/admin-logs",',
        to: 'getLogsUrl("ADMIN_LOGS"),',
      },
      {
        from: "`http://localhost:8000/api/reports/${currentItem._id}`,",
        to: '`${getApiUrl("/api/reports")}/${currentItem._id}`,',
      },
      {
        from: "`http://localhost:8000/api/reports/${item._id}/claim`,",
        to: '`${getApiUrl("/api/reports")}/${item._id}/claim`,',
      },
    ],
  },
  {
    file: "src/pages/FoundItemsPage/Section1.jsx",
    replacements: [
      {
        from: 'const logEndpoint = "http://localhost:8000/api/logs/user-logs";',
        to: 'const logEndpoint = getLogsUrl("USER_LOGS");',
      },
      {
        from: 'const response = await axios.get("http://localhost:8000/api/reports");',
        to: 'const response = await axios.get(getApiUrl("/api/reports"));',
      },
      {
        from: "await axios.delete(`http://localhost:8000/api/reports/${id}`, {",
        to: 'await axios.delete(`${getApiUrl("/api/reports")}/${id}`, {',
      },
      {
        from: '"http://localhost:8000/api/logs/admin-logs",',
        to: 'getLogsUrl("ADMIN_LOGS"),',
      },
      {
        from: "`http://localhost:8000/api/reports/${currentItem._id}`,",
        to: '`${getApiUrl("/api/reports")}/${currentItem._id}`,',
      },
      {
        from: "`http://localhost:8000/api/reports/${modalItem._id}/claim`",
        to: '`${getApiUrl("/api/reports")}/${modalItem._id}/claim`',
      },
    ],
  },
  {
    file: "src/pages/EditProfilePage/Section1.jsx",
    replacements: [
      {
        from: "`http://localhost:8000/api/users/${user._id}`,",
        to: '`${getApiUrl("/api/users")}/${user._id}`,',
      },
    ],
  },
  {
    file: "src/pages/ContactusPage/Section1.jsx",
    replacements: [
      {
        from: 'await axios.post("http://localhost:8000/api/contact", formData, {',
        to: 'await axios.post(getApiUrl("/api/contact"), formData, {',
      },
    ],
  },
  {
    file: "src/pages/AllUserLogsPage/Section1.jsx",
    replacements: [
      {
        from: "`http://localhost:8000/api/logs/user-logs`,",
        to: 'getLogsUrl("USER_LOGS"),',
      },
    ],
  },
  {
    file: "src/pages/AdminLogsPage/Section1.jsx",
    replacements: [
      {
        from: "`http://localhost:8000/api/logs/admin-logs`,",
        to: 'getLogsUrl("ADMIN_LOGS"),',
      },
    ],
  },
  {
    file: "src/pages/UserLogsPage/Section1.jsx",
    replacements: [
      {
        from: "`http://localhost:8000/api/logs/user-logs`,",
        to: 'getLogsUrl("USER_LOGS"),',
      },
    ],
  },
];

// Add import statements to files that need them
const filesNeedingImport = [
  "src/pages/LostItemsPage/Section1.jsx",
  "src/pages/FoundItemsPage/Section1.jsx",
  "src/pages/EditProfilePage/Section1.jsx",
  "src/pages/ContactusPage/Section1.jsx",
  "src/pages/AllUserLogsPage/Section1.jsx",
  "src/pages/AdminLogsPage/Section1.jsx",
];

// Update each file
filesToUpdate.forEach(({ file, replacements }) => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, "utf8");

    // Add import if needed
    if (filesNeedingImport.includes(file) && !content.includes("getApiUrl")) {
      const importStatement =
        'import { getApiUrl, getLogsUrl } from "../../config/api";';
      const lastImportIndex = content.lastIndexOf("import");
      const insertIndex = content.indexOf("\n", lastImportIndex) + 1;
      content =
        content.slice(0, insertIndex) +
        importStatement +
        "\n" +
        content.slice(insertIndex);
    }

    // Apply replacements
    replacements.forEach(({ from, to }) => {
      content = content.replace(
        new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
        to
      );
    });

    fs.writeFileSync(file, content);
    console.log(`Updated: ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log("All backend URLs updated successfully!");
