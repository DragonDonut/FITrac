import React from 'react'

export default function LevelDisplay({ level, nextRewardLevel }) {
  const percent = nextRewardLevel
    ? Math.round((level / nextRewardLevel) * 100)
    : 100

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-4 mb-4">
      <div className="font-semibold mb-2">Level Progress</div>
      <div className="h-4 bg-gray-300 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div
          className="bg-green-500 h-full transition-all"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-300 mt-1">
        Level {level}
        {nextRewardLevel && ` → Next reward at level ${nextRewardLevel}`}
      </div>
    </div>
  )
}
