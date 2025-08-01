import React, { useState } from 'react'

export default function RewardManager({ rewards, onUpdate, onAdd, onToggleHidden, onClaimed, onDelete }) {
  const [newTitle, setNewTitle] = useState('')
  const [newLevel, setNewLevel] = useState(1)
  const [newType, setNewType] = useState('🧡')

  function add() {
    if (!newTitle) return
    onAdd({
      id: crypto.randomUUID(),
      title: newTitle,
      level: Number(newLevel),
      type: newType,
      hidden: false,
      claimed: false,
      createdAt: new Date().toISOString()
    })
    setNewTitle('')
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-4 mb-4 text-black dark:text-white">
      <div className="font-semibold mb-2">Rewards</div>
      <div className="flex gap-2 flex-wrap mb-4">
        <input
          placeholder="Title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          className="border dark:border-zinc-600 rounded p-2 flex-1 bg-white dark:bg-zinc-900 text-black dark:text-white"
        />
        <input
          type="number"
          min="1"
          placeholder="Level"
          value={newLevel}
          onChange={e => setNewLevel(e.target.value)}
          className="border dark:border-zinc-600 rounded w-24 p-2 bg-white dark:bg-zinc-900 text-black dark:text-white"
        />
        <select
          value={newType}
          onChange={e => setNewType(e.target.value)}
          className="border dark:border-zinc-600 rounded p-2 bg-white dark:bg-zinc-900 text-black dark:text-white"
        >
          <option value="🧡">Relationship 🧡</option>
          <option value="🤝">Physical 🤝</option>
          <option value="🍕">Cheat Day 🍕</option>
          <option value="🎁">Surprise 🎁</option>
        </select>
        <button
          onClick={add}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
      <div className="space-y-2">
        {rewards.map(r => (
          <div
            key={r.id}
            className="flex items-center justify-between border dark:border-zinc-600 p-2 rounded bg-white dark:bg-zinc-900"
          >
            <div className="flex gap-2 items-center">
              <div className="text-2xl">{r.type}</div>
              <div>
                <div className="font-medium">{r.hidden ? '???' : r.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Level {r.level}</div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={r.hidden}
                  onChange={() => onToggleHidden(r.id)}
                /> Hidden
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={r.claimed}
                  onChange={() => onClaimed(r.id)}
                /> Claimed
              </label>
              <button
                onClick={() => onDelete(r.id)}
                className="text-sm text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
