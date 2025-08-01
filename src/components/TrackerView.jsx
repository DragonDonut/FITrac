import React, { useEffect, useState } from 'react'
import LevelDisplay from './LevelDisplay.jsx'
import LogTable from './LogTable.jsx'
import { db, getUserDoc } from '../firebase.js'
import { doc, updateDoc } from 'firebase/firestore'
import confetti from 'canvas-confetti'


function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function TrackerView() {
  const [level, setLevel] = useState(0)
  const [logs, setLogs] = useState([])
  const [rewards, setRewards] = useState([])
  const [nextReward, setNextReward] = useState(null)
  const [todayRemark, setTodayRemark] = useState('')
  const [showRewardMessage, setShowRewardMessage] = useState(false)

  const userId = 'default'

  useEffect(() => {
    async function load() {
      const snap = await getUserDoc(userId)
      const data = snap.data()
      setLevel(data.level || 0)
      setRewards(data.rewards || [])
      // Detect new reward earned today
      const newReward = (data.rewards || []).find(r => {
        return (
          (data.level || 0) >= r.level &&
          !r.claimed &&
          !r.celebrated
        )
      })
      if (newReward) {
        // Launch confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
        setShowRewardMessage(true)
        setTimeout(() => setShowRewardMessage(false), 3000)

        // Mark as celebrated so it doesn’t happen again
        const updatedRewards = data.rewards.map(r =>
          r.id === newReward.id ? { ...r, celebrated: true } : r
        )
        await updateDoc(doc(db, 'users', userId), { rewards: updatedRewards })
      }
      const entries = Object.entries(data.actions || {})
        .map(([date, a]) => ({
          date,
          meal: a.meal,
          workout: a.workout,
          remark: a.remark || '',
        }))
        .sort((a, b) => b.date.localeCompare(a.date))
      setLogs(entries)
      setTodayRemark(entries.find((e) => e.date === todayStr())?.remark || '')
      computeNext(data.rewards || [], data.level || 0)
    }
    load()
  }, [])

  function computeNext(list, lvl) {
    const visible = list
      .filter((r) => !r.hidden && !r.claimed)
      .sort((a, b) => a.level - b.level)
    const next = visible.find((r) => r.level > lvl)
    setNextReward(next)
  }

  async function saveRemark() {
    const today = todayStr()
    const ref = doc(db, 'users', userId)
    const snap = await getUserDoc(userId)
    const data = snap.data()
    const actions = data.actions || {}
    const todayEntry = actions[today] || {
      meal: false,
      workout: false,
      remark: '',
    }
    todayEntry.remark = todayRemark
    actions[today] = todayEntry
    await updateDoc(ref, { actions })
    const entries = Object.entries(actions)
      .map(([date, a]) => ({
        date,
        meal: a.meal,
        workout: a.workout,
        remark: a.remark || '',
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
    setLogs(entries)
  }

  return (
    <div className='relative'>
      {showRewardMessage && (
        <div className="fixed top-6 inset-x-0 mx-auto bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade text-center w-fit">
          🎉 New reward unlocked!
        </div>
      )}
      <div className="max-w-xl mx-auto p-20 px-4 text-zinc-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-2 text-center">Bebo's Tracker</h1>
        <LevelDisplay level={level} nextRewardLevel={nextReward?.level || null} />
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-4 mb-4">
          <div className="font-semibold mb-2">Today's Status</div>
          <div className="flex gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Meal</div>
              <div>{logs.find((e) => e.date === todayStr())?.meal ? '✔' : '✖'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-300">Workout</div>
              <div>{logs.find((e) => e.date === todayStr())?.workout ? '✔' : '✖'}</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm text-gray-500 dark:text-gray-300">Remark</div>
            <textarea
              value={todayRemark}
              onChange={(e) => setTodayRemark(e.target.value)}
              onBlur={saveRemark}
              className="w-full border border-zinc-300 dark:border-zinc-700 rounded p-2 bg-white dark:bg-zinc-900 text-black dark:text-white"
              placeholder="Write something..."
            ></textarea>
          </div>
        </div>
        <LogTable logs={logs} />
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-4">
          <div className="font-semibold mb-2">Rewards Earned / Claimed</div>
          <div className="grid grid-cols-1 gap-2">
            {rewards
              .filter((r) => !r.hidden && level >= r.level)
              .sort((a, b) => a.level - b.level)
              .map((r) => (
                <div
                  key={r.id}
                  className={`flex items-center gap-3 p-2 rounded border dark:border-zinc-700 ${
                    r.claimed ? 'opacity-40' : ''
                  }`}
                >
                  <div className="text-2xl">{r.type}</div>
                  <div className="flex-1">
                    <div className="font-medium">{r.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">
                      Level {r.level}
                    </div>
                  </div>
                  {r.claimed && <div className="text-sm text-green-600">Claimed</div>}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
