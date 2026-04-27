# 📊 Analytics

Monitor and visualize the performance of your infrastructure with custom dashboards and graphs. The Analytics module lets you track key metrics like CPU usage, RAM usage, VM state, and more — all in real time.

---

## 🗂️ Overview

The Analytics feature is organized into two levels:

1. **Dashboards** — A collection of graphs grouped under a single name and description.
2. **Graphs** — Individual visualizations that plot one or more metric series over time.

```
Analytics
 └── Dashboard (e.g. "Production Monitoring")
       ├── Graph 1 (e.g. "CPU Usage — All VMs")
       ├── Graph 2 (e.g. "RAM Used — Provider X")
       └── Graph 3 (e.g. "Active VMs — All Providers")
```

---

## 📋 Step 1 — Manage Dashboards

When you navigate to the **Analytics** page, you land on the **Dashboard List** screen.

### What you see

- A list of all your previously created dashboards, each showing its **name** and **description**.
- A **"Create Dashboard"** button in the top-right corner.

### Actions available

| Action             | How                                                                 |
|--------------------|---------------------------------------------------------------------|
| **Create**         | Click **Create Dashboard** → Fill in Name & Description → Submit    |
| **Edit**           | Click the ✏️ edit icon on any dashboard card to update its details   |
| **Delete**         | Click the 🗑️ delete icon on any dashboard card to remove it         |
| **Open**           | Click anywhere on a dashboard card to enter the **Graph List** view |

### Create / Edit Dashboard Modal

| Field           | Description                                      | Required |
|-----------------|--------------------------------------------------|----------|
| **Name**        | A short, meaningful name for the dashboard       | ✅       |
| **Description** | A brief summary of what this dashboard tracks    | No       |

> 💡 **Tip:** Use descriptive names like *"Provider Health"* or *"VM Resource Usage"* so you can quickly identify dashboards later.

---

## 📈 Step 2 — Manage Graphs

After opening a dashboard, you are taken to the **Graph List** page. This page displays all the graphs belonging to that dashboard.

### What you see

- All graphs rendered one by one in a responsive grid (2 columns on desktop, 1 on mobile).
- Each graph card shows:
  - **Graph Name**
  - **Graph Type** (e.g., Time Series)
  - **Time Range** — the window of data currently displayed
  - **The rendered chart** itself with plotted data
- A **"Create Graph"** button in the top-right corner.

### Actions available

| Action          | How                                                              |
|-----------------|------------------------------------------------------------------|
| **Create**      | Click **Create Graph** → Fill the form → Submit                  |
| **View Large**  | Click on any graph card to open an **expanded full-screen modal**|
| **Delete**      | Click the 🗑️ delete icon on the graph card                      |

---

## 🛠️ Step 3 — Create a Graph

Clicking **"Create Graph"** opens a modal form with two sections: **Graph Settings** and **Series Configuration**.

### 3.1 Graph Settings

These are the base properties of the graph.

| Field                          | Description                                                                                              | Default       | Required |
|--------------------------------|----------------------------------------------------------------------------------------------------------|---------------|----------|
| **Graph Name**                 | A descriptive name for the graph (e.g., "CPU Usage Last 1 Hour")                                         | —             | ✅       |
| **Graph Type**                 | The type of visualization.  Currently supported: `Time Series`                                            | Time Series   | ✅       |
| **Default Time Window (mins)** | The time frame shown on page load. E.g., `30` means data from *now – 30 minutes* to *now* is displayed. | 60            | ✅       |
| **Refresh Interval (secs)**    | How often the graph auto-refreshes with the latest data.                                                 | 30            | ✅       |

> 📌 **Example:** A graph with Default Time Window = `30` and Refresh Interval = `15` will show the last 30 minutes of data and automatically update every 15 seconds.

---

### 3.2 Series Configuration

A graph can contain **multiple series**. Each series represents a single data line on the chart. You can add or remove series as needed using the **"+ Add series"** and **"Remove"** buttons.

Each series requires the following configuration:

#### Entity Type

Choose the type of resource you want to monitor.

| Entity Type   | Description                              |
|---------------|------------------------------------------|
| **VM**        | Virtual Machine level metrics            |
| **Provider**  | Provider (host machine) level metrics    |

> 🔧 **Network** entity type is planned for future releases.

---

#### Entity Selection

Based on the **Entity Type** you choose, you will see different options:

##### If Entity Type = **VM**

| Field         | Options                                                                |
|---------------|------------------------------------------------------------------------|
| **Select VM** | `All VMs` — aggregate across every VM you own                          |
|               | *or* pick a **specific VM** from the dropdown (listed by VM name)      |

##### If Entity Type = **Provider**

| Field              | Options                                                                           |
|--------------------|-----------------------------------------------------------------------------------|
| **Select Provider**| `All Providers` — aggregate across every provider                                 |
|                    | *or* pick a **specific Provider** from the dropdown                               |

When a **specific provider** is selected, an additional dropdown appears:

| Field                     | Options                                                        |
|---------------------------|----------------------------------------------------------------|
| **Select Provider's VM**  | `All Provider VMs` — aggregate across all VMs on that provider |
|                           | *or* pick a **specific VM** belonging to that provider         |

---

#### Metric Name

The available metrics change based on the selected **Entity Type**.

##### VM Metrics

| Metric Name       | Description                                   |
|--------------------|-----------------------------------------------|
| **CPU Used**       | Current CPU usage of the VM (%)               |
| **CPU Allocated**  | Total CPU allocated to the VM                 |
| **RAM Used**       | Current RAM consumption of the VM             |
| **RAM Allocated**  | Total RAM allocated to the VM                 |
| **State**          | Current state of the VM (running / stopped)   |

##### Provider Metrics

| Metric Name            | Description                                         |
|------------------------|-----------------------------------------------------|
| **Active VMs**         | Number of currently running VMs on the provider      |
| **Inactive VMs**       | Number of stopped VMs on the provider                |
| **Provider Heartbeat** | Health check / uptime signal from the provider       |
| **CPU Used**           | Aggregate CPU usage across VMs on the provider       |
| **CPU Allocated**      | Aggregate CPU allocated across VMs on the provider   |
| **RAM Used**           | Aggregate RAM used across VMs on the provider        |
| **RAM Allocated**      | Aggregate RAM allocated across VMs on the provider   |

---

#### Aggregation

Defines how data points are aggregated when multiple values exist for the same timestamp.

| Aggregation | Description                             |
|-------------|-----------------------------------------|
| **Sum**     | Adds up all values (default for "All")  |
| **Average** | Computes the mean of all values         |

> ℹ️ When you select **All VMs** or **All Providers**, the aggregation defaults to **Sum**. When you select a specific VM, it defaults to **Average**.

---

### 3.3 Example: Creating a Multi-Series Graph

Let's say you want a single graph that shows **CPU Used** for a specific VM and **Active VMs** for a provider side by side.

**Graph Settings:**
- Name: `Provider Alpha — Overview`
- Type: `Time Series`
- Default Time Window: `60` minutes
- Refresh Interval: `30` seconds

**Series 1:**
- Entity Type: `VM`
- Select VM: `my-web-server-01`
- Metric Name: `CPU Used`
- Aggregation: `Average`

**Series 2:**
- Entity Type: `Provider`
- Select Provider: `Provider Alpha`
- Select Provider's VM: `All Provider VMs`
- Metric Name: `Active VMs`
- Aggregation: `Sum`

Click **"Create & Submit"** and the graph will be created and appear on your dashboard.

---

## 🔍 Step 4 — Viewing a Graph in Detail

Click on any graph card to open it in an **expanded full-screen modal**. In this view you get:

### Features

| Feature                  | Description                                                                     |
|--------------------------|---------------------------------------------------------------------------------|
| **Larger Chart**         | The graph is rendered at a much larger size for better readability               |
| **Time Range Filter**    | Set a custom **Start Date/Time** and **End Date/Time**, then click **Apply**     |
| **Graph Type Toggle**    | Switch between **Line** and **Area** chart styles using the toggle button        |
| **Current Time Range**   | Displayed at the top showing what window of data is currently rendered           |

### How to use the Time Filter

1. Set the **Start Timestamp** (date + time).
2. Set the **End Timestamp** (date + time).
3. Click **Apply**.
4. The graph re-fetches data for the selected time window and re-renders.

> 💡 This is useful for investigating historical incidents or comparing metrics across specific time periods.

---

## 🔄 Data Refresh Behavior

- When the Graph List page loads, **all graphs fetch data in parallel** for their respective default time windows.
- Each graph independently loads its data — you'll see individual loading spinners on each card.
- After initial load, graphs auto-refresh at their configured **Refresh Interval**.
- If data for a series is empty for the selected time range, a message is shown: *"No results for this time range. Adjust the time filter to view results."*

---

## ⚡ Quick Reference

```
Create Dashboard → Open Dashboard → Create Graph → View / Analyze
```

| Concept            | Key Points                                                       |
|--------------------|------------------------------------------------------------------|
| **Dashboard**      | Container for graphs. Has a name and description.                |
| **Graph**          | A chart with 1+ series. Has type, time window, refresh interval. |
| **Series**         | A single data line. Defined by entity type, entity, and metric.  |
| **Entity Type**    | VM or Provider.                                                  |
| **Metric**         | The measurement to track (CPU, RAM, State, Active VMs, etc.).    |
| **Aggregation**    | How to combine values: Sum or Average.                           |
| **Time Window**    | Default duration of data shown on load (in minutes).             |
| **Refresh**        | Auto-update interval (in seconds).                               |
