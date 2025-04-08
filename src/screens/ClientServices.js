import React, { useEffect, useState } from "react";
import { apiCall } from "../Api";
import Navbar from "../components/Navbar";
import "../css/ClientServices.css";
import CustomSearch from "../components/CustomSearch";

const ClientServices = () => {
  const [selectedVM, setSelectedVM] = useState(null);
  const [vms, setVms] = useState([]);

  useEffect(() => {
    apiCall("get", "/vms/allVms")
      .then((data) => {
        console.log(data);
        if (data.all_vms && Array.isArray(data.all_vms)) {
          setVms(data.all_vms);
        } else throw new Error("all_vms key not present in response data");
      })
      .catch((error) => {
        console.log(error);
        // alert(error);
      });

    // fetchVms();
  }, []);

  // Function to handle VM selection
  const handleSelectVM = (vm) => {
    setSelectedVM(vm);
  };

  // Functions for button actions
  const activateVM = () => {
    if (selectedVM) {
      alert(`Activating VM: ${selectedVM.vm_name}`);

      apiCall(
        "get",
        "/vms/start?vm_id=" +
          selectedVM.vm_id +
          "&provider_id=" +
          selectedVM.provider_id
      )
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          alert("Error: " + error);
        });
    }
  };

  const deleteVM = () => {
    if (selectedVM) {
      alert(`Deleting VM: ${selectedVM.vm_name}`);
    }
    apiCall(
      "get",
      "/vms/remove?vm_id=" +
        selectedVM.vm_id +
        "&provider_id=" +
        selectedVM.provider_id
    )
      .then((data) => {
        alert(data.message);
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  };

  const deactivateVM = () => {
    if (selectedVM) {
      alert(`Deactivating VM: ${selectedVM.vm_name}`);
    }
    apiCall(
      "get",
      "/vms/stop?vm_id=" +
        selectedVM.vm_id +
        "&provider_id=" +
        selectedVM.provider_id
    )
      .then((data) => {
        alert(data.message);
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  };

  return (
    <>
      <div className="bg-gray-50 p-6 font-sans mt-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          VM Instances
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - VM List */}
          <div className="flex-1 min-w-[400px]">
            <CustomSearch />

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden text-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-gray-700 font-medium">
                  <tr>
                    <th className="px-4 py-3">Select</th>
                    <th className="px-4 py-3">Provider Name</th>
                    <th className="px-4 py-3">VM Name</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vms.map((vm, index) => (
                    <tr
                      key={index}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <input
                          type="radio"
                          name="selectedVM"
                          onChange={() => handleSelectVM(vm)}
                        />
                      </td>
                      <td className="px-4 py-3">{vm.provider_name}</td>
                      <td className="px-4 py-3">{vm.vm_name}</td>
                      <td className="px-4 py-3">
                        {vm.status === "active" ? "✅" : "❌"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side - VM Details */}
          <div className="flex-1 min-w-[350px] bg-white p-6 border border-gray-200 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              VM Details
            </h2>

            {selectedVM ? (
              <>
                <div className="mb-4 space-y-2">
                  <p>
                    <span className="font-medium text-gray-700">vCPUs: </span>
                    <span className="text-gray-600">{selectedVM.vcpu}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">RAM: </span>
                    <span className="text-gray-600">{selectedVM.ram}</span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">Storage: </span>
                    <span className="text-gray-600">{selectedVM.storage}</span>
                  </p>
                </div>

                <div className="mb-4 space-y-2">
                  <p>
                    <span className="font-medium text-gray-700">
                      Wireguard IP:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedVM.wireguard_ip}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Wireguard Pubkey:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedVM.wireguard_public_key}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      Wireguard Endpoint:{" "}
                    </span>
                    <span className="text-gray-600">
                      {selectedVM.wireguard_endpoint}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={activateVM}
                    disabled={selectedVM.status === "active"}
                  >
                    Start VM
                  </button>
                  <button
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={deactivateVM}
                    disabled={selectedVM.status === "inactive"}
                  >
                    Stop VM
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={deleteVM}
                    disabled={selectedVM.status === "active"}
                  >
                    Delete VM
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-500 italic">Select a VM to see details</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientServices;
