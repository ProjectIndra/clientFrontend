import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Buckets.css";
import Navbar from "../components/Navbar";

const fakeData = [
  {
    name: "documents",
    path: "/user/avinash/documents",
    type: "DIRECTORY",
    permission: "drwxr-xr-x",
    owner: "avinash",
    group: "hdfs",
    size: "-",
    lastModified: "Mar 20 14:23",
    replication: "-",
    blockSize: "-",
  },
  {
    name: "photos",
    path: "/user/avinash/photos",
    type: "DIRECTORY",
    permission: "drwxr-xr-x",
    owner: "avinash",
    group: "hdfs",
    size: "-",
    lastModified: "Mar 21 09:10",
    replication: "-",
    blockSize: "-",
  },
  {
    name: "report.pdf",
    path: "/user/avinash/report.pdf",
    type: "FILE",
    permission: "-rw-r--r--",
    owner: "avinash",
    group: "hdfs",
    size: "512 KB",
    lastModified: "Mar 22 11:45",
    replication: "1",
    blockSize: "128 MB",
  },
  {
    name: "textfile.txt",
    path: "/user/avinash/textfile.txt",
    type: "FILE",
    permission: "-rw-r--r--",
    owner: "avinash",
    group: "hdfs",
    size: "16 B",
    lastModified: "Mar 23 10:31",
    replication: "1",
    blockSize: "128 MB",
  },
];

const Buckets = () => {
  const [path, setPath] = useState("/user/avinash");
  const [entries, setEntries] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchDirectory(path);
  }, [path]);

  const fetchDirectory = async (currentPath) => {
    try {
      // Simulating API response delay
      setTimeout(() => {
        setEntries(fakeData);
        setSelectedItems([]);
      }, 500);
    } catch (err) {
      console.error("Error fetching directory:", err);
    }
  };

  const handleFolderClick = (folderName) => {
    setPath((prev) => `${prev}/${folderName}`);
  };

  const handleFileClick = (filePath) => {
    window.location.href = `/api/download?path=${encodeURIComponent(filePath)}`;
  };

  const handleBackClick = () => {
    const segments = path.split("/");
    if (segments.length > 1) {
      segments.pop();
      setPath(segments.join("/") || "/");
    }
  };

  const handleCreateDir = async () => {
    const dirName = prompt("Enter new folder name:");
    if (dirName) {
      await axios.post("/api/mkdir", { path: `${path}/${dirName}` });
      fetchDirectory(path);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", path);
      await axios.post("/api/upload", formData);
      fetchDirectory(path);
    }
  };

  const handleDelete = async () => {
    await axios.post("/api/delete", { paths: selectedItems });
    fetchDirectory(path);
  };

  const toggleSelect = (itemPath) => {
    setSelectedItems((prev) =>
      prev.includes(itemPath)
        ? prev.filter((p) => p !== itemPath)
        : [...prev, itemPath]
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800">My Buckets</h2>

      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 rounded bg-lime-300 text-black font-medium text-sm hover:brightness-110 transition"
            onClick={handleBackClick}
          >
            ⬅️ Back
          </button>
          <input
            className="flex-1 px-4 py-2 rounded border border-gray-300 bg-gray-100 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
            value={path}
            readOnly
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            className="px-4 py-2 rounded bg-lime-300 text-black font-medium text-sm hover:brightness-110 transition"
            onClick={handleCreateDir}
          >
            📁 Create Directory
          </button>

          <label className="px-4 py-2 rounded bg-lime-300 text-black font-medium text-sm cursor-pointer hover:brightness-110 transition">
            📤 Upload
            <input type="file" hidden onChange={handleUpload} />
          </label>

          <button
            className="px-4 py-2 rounded bg-red-500 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDelete}
            disabled={selectedItems.length === 0}
          >
            🗑️ Delete
          </button>
        </div>

        <table className="w-full text-sm text-left border-t border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-3">Select</th>
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">Size</th>
              <th className="py-2 px-3">Last Modified</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="py-2 px-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(entry.path)}
                    onChange={() => toggleSelect(entry.path)}
                  />
                </td>
                <td className="py-2 px-3">
                  <span
                    className={`cursor-pointer font-medium ${
                      entry.type === "DIRECTORY"
                        ? "text-blue-600"
                        : "text-gray-800"
                    }`}
                    onClick={() =>
                      entry.type === "DIRECTORY"
                        ? handleFolderClick(entry.name)
                        : handleFileClick(entry.path)
                    }
                  >
                    {entry.name}
                  </span>
                </td>
                <td className="py-2 px-3">{entry.size}</td>
                <td className="py-2 px-3">{entry.lastModified}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Buckets;
