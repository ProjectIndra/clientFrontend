import Loading from './Loading';

/**
 * Standardized Table Component
 * 
 * @param {Array} columns - { header: 'Name', cell: (row) => node, accessor: 'key', width: 'w-12' }
 * @param {Array} data - Array of items
 * @param {boolean} isLoading - Show loading spinner
 * @param {string} emptyMessage - Message when no rows
 * @param {string|Function} rowKey - Accessor string or function for React row key
 * @param {Function} onRowClick - Optional click handler for rows
 * @param {Function} rowClassName - Optional function receiving a row and returning a custom class string
 */
const Table = ({
  columns,
  data,
  isLoading,
  emptyMessage = "No data available",
  rowKey = "id",
  onRowClick,
  rowClassName,
}) => {
  return isLoading ? (
    <Loading />
  ) : (
    <div className="relative bg-palette-surface border border-palette-border rounded-lg overflow-x-auto text-sm w-full">
          
        <table className="w-full text-left min-w-full">
          <thead className="bg-palette-surfaceMuted text-palette-textSecondary uppercase text-xs font-bold whitespace-nowrap">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className={`px-4 py-3 ${col.width || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-palette-border">
            {!isLoading && (!data || data.length === 0) ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-palette-textMuted italic">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data?.map((row, index) => {
                const key = typeof rowKey === 'function' ? rowKey(row, index) : row[rowKey] || index;
                const rClass = rowClassName
                  ? rowClassName(row, index)
                  : "hover:bg-palette-wrapper transition";
                  
                return (
                  <tr
                    key={key}
                    className={rClass}
                    onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`px-4 py-3 ${col.cellClassName || ''}`}>
                        {col.cell ? col.cell(row, index) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
  );
};

export default Table;
