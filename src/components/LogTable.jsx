import React from 'react'

export default function LogTable({ logs }) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-4 mb-4">
      <div className="font-semibold mb-2">Log History</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 dark:text-gray-300 border-b border-zinc-300 dark:border-zinc-700">
            <th className="py-1">Date</th>
            <th className="py-1">Meal</th>
            <th className="py-1">Workout</th>
            <th className="py-1">Remark</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.date} className="border-t border-zinc-200 dark:border-zinc-700">
              <td className="py-1">{log.date}</td>
              <td className="py-1">{log.meal ? '✔' : '✖'}</td>
              <td className="py-1">{log.workout ? '✔' : '✖'}</td>
              <td className="py-1">{log.remark || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
