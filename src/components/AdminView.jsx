import React, { useEffect, useState } from 'react'
import LevelDisplay from './LevelDisplay.jsx'
import LogTable from './LogTable.jsx'
import RewardManager from './RewardManager.jsx'
import { db, getUserDoc } from '../firebase.js'
import { doc, updateDoc } from 'firebase/firestore'

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function AdminView() {
  const [level, setLevel] = useState(0)
  const [logs, setLogs] = useState([])
  const [rewards, setRewards] = useState([])
  const [nextReward, setNextReward] = useState(null)
  const [message, setMessage] = useState('')

  const userId = 'default'

  useEffect(() => {
    async function load() {
      const snap = await getUserDoc(userId)
      const data = snap.data()
      setLevel(data.level || 0)
      setRewards(data.rewards || [])
      setLogs(
        Object.entries(data.actions || {})
          .map(([date, a]) => ({
            date,
            meal: a.meal,
            workout: a.workout,
            remark: a.remark || ''
          }))
          .sort((a, b) => b.date.localeCompare(a.date))
      )
      computeNextReward(data.rewards || [], data.level || 0)
    }
    load()
  }, [])

  function computeNextReward(list, lvl) {
    const visible = list
      .filter((r) => !r.hidden && !r.claimed)
      .sort((a, b) => a.level - b.level)
    const next = visible.find((r) => r.level > lvl)
    setNextReward(next)
  }

  async function toggleAction(type) {
    const today = todayStr()
    const ref = doc(db, 'users', userId)
    const snap = await getUserDoc(userId)
    const data = snap.data()
    const actions = data.actions || {}
    const todayEntry = actions[today] || { meal: false, workout: false, remark: '' }
    if (
      (type === 'meal' && todayEntry.meal) ||
      (type === 'workout' && todayEntry.workout)
    )
      return
    todayEntry[type] = true
    let newLevel = data.level || 0
    newLevel += 0.5
    actions[today] = todayEntry
    await updateDoc(ref, {
      actions,
      level: newLevel,
      previousLevel: data.level || 0,
      lastActive: today
    })
    setLevel(newLevel)
    setLogs(
      Object.entries(actions)
        .map(([date, a]) => ({
          date,
          meal: a.meal,
          workout: a.workout,
          remark: a.remark || ''
        }))
        .sort((a, b) => b.date.localeCompare(a.date))
    )
    computeNextReward(rewards, newLevel)
    setMessage('She did it!')
  }

  async function addReward(r) {
    const ref = doc(db, 'users', userId)
    const snap = await getUserDoc(userId)
    const data = snap.data()
    const list = data.rewards || []
    list.push(r)
    await updateDoc(ref, { rewards: list })
    setRewards(list)
    computeNextReward(list, level)
  }

  async function toggleHidden(id) {
    const ref = doc(db, 'users', userId)
    const snap = await getUserDoc(userId)
    const data = snap.data()
    const list = (data.rewards || []).map((r) =>
      r.id === id ? { ...r, hidden: !r.hidden } : r
    )
    await updateDoc(ref, { rewards: list })
    setRewards(list)
    computeNextReward(list, level)
  }

  async function toggleClaimed(id) {
    const ref = doc(db, 'users', userId)
    const snap = await getUserDoc(userId)
    const data = snap.data()
    const list = (data.rewards || []).map((r) =>
      r.id === id ? { ...r, claimed: !r.claimed } : r
    )
    await updateDoc(ref, { rewards: list })
    setRewards(list)
    computeNextReward(list, level)
  }

  async function deleteReward(id) {
    const ref = doc(db, 'users', userId)
    const snap = await getUserDoc(userId)
    const data = snap.data()
    const updatedRewards = (data.rewards || []).filter(r => r.id !== id)
    await updateDoc(ref, { rewards: updatedRewards })
    setRewards(updatedRewards)
    computeNextReward(updatedRewards, level)
  }

  async function overrideReset() {
    const ref = doc(db, 'users', userId)
    const snap = await getUserDoc(userId)
    const data = snap.data()
    const prev = data.previousLevel || 0
    await updateDoc(ref, { level: prev })
    setLevel(prev)
    computeNextReward(rewards, prev)
  }

  return (
    <div className="max-w-xl mx-auto p-10 px-4">
      <h1 className="text-2xl font-bold mb-2">NY's Dashboard</h1>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => toggleAction('meal')}
          disabled={logs.find(e => e.date === todayStr())?.meal}
          className={`flex-1 py-2 rounded font-semibold transition-all shadow ${
            logs.find(e => e.date === todayStr())?.meal
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {logs.find(e => e.date === todayStr())?.meal ? 'Meal Logged' : 'Log Meal'}
        </button>

        <button
          onClick={() => toggleAction('workout')}
          disabled={logs.find(e => e.date === todayStr())?.workout}
          className={`flex-1 py-2 rounded font-semibold transition-all shadow ${
            logs.find(e => e.date === todayStr())?.workout
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {logs.find(e => e.date === todayStr())?.workout ? 'Workout Logged' : 'Log Workout'}
        </button>
      </div>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-4 mb-4">
        <LevelDisplay level={level} nextRewardLevel={nextReward?.level || null} />
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-4 mb-4">
        <LogTable logs={logs} />
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-4 mb-4">
        <RewardManager
          rewards={rewards}
          onAdd={addReward}
          onToggleHidden={toggleHidden}
          onClaimed={toggleClaimed}
          onUpdate={() => {}}
          onDelete={deleteReward}
        />
      </div>
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-4 mb-4 flex justify-between items-center">
        <div>Override reset (restore previous level):</div>
        <button
          onClick={overrideReset}
          className="bg-yellow-500 px-4 py-2 rounded"
        >
          Override
        </button>
      </div>
    </div>
  )
}
