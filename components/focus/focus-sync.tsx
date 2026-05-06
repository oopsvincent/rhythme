'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useFocusStore } from '@/store/useFocusStore'

export function FocusSync() {
  const isReceivingRef = useRef(false)

  useEffect(() => {
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel> | null = null
    let unsubscribeStore: (() => void) | null = null

    async function setupSync() {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return

      channel = supabase.channel(`focus-sync-${user.id}`)

      channel
        .on('broadcast', { event: 'sync-state' }, (payload) => {
          if (payload.payload) {
            isReceivingRef.current = true
            useFocusStore.setState(payload.payload)
            // allow a tick to process before we allow sending again
            setTimeout(() => {
               isReceivingRef.current = false
            }, 50)
          }
        })
        .on('broadcast', { event: 'request-sync' }, () => {
          // If we have an active timer running, send our state to the new client
          const state = useFocusStore.getState()
          if (state.isRunning || state.activeSessionId) {
            channel?.send({
              type: 'broadcast',
              event: 'sync-state',
              payload: {
                timeLeft: state.timeLeft,
                isRunning: state.isRunning,
                sessionType: state.sessionType,
                startedAt: state.startedAt,
                targetDuration: state.targetDuration,
                activeSessionId: state.activeSessionId,
                activeTaskId: state.activeTaskId,
              }
            }).catch(() => {})
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            // Ask existing connected devices (if any) for the current timer state
            channel?.send({
              type: 'broadcast',
              event: 'request-sync',
            }).catch(() => {})
          }
        })

      unsubscribeStore = useFocusStore.subscribe((state, prevState) => {
        // Only broadcast if we didn't just receive this from broadcast
        if (isReceivingRef.current) return
        
        // We only care about syncing the critical persistent state that drives the timer
        // We don't broadcast every single tick of timeLeft when it's running
        if (
          state.isRunning !== prevState.isRunning ||
          state.sessionType !== prevState.sessionType ||
          state.startedAt !== prevState.startedAt ||
          state.targetDuration !== prevState.targetDuration ||
          state.activeSessionId !== prevState.activeSessionId ||
          state.activeTaskId !== prevState.activeTaskId ||
          (!state.isRunning && state.timeLeft !== prevState.timeLeft)
        ) {
          if (channel) {
            channel.send({
              type: 'broadcast',
              event: 'sync-state',
              payload: {
                timeLeft: state.timeLeft,
                isRunning: state.isRunning,
                sessionType: state.sessionType,
                startedAt: state.startedAt,
                targetDuration: state.targetDuration,
                activeSessionId: state.activeSessionId,
                activeTaskId: state.activeTaskId,
              }
            }).catch(() => {})
          }
        }
      })
    }

    void setupSync()

    return () => {
      if (channel) {
        void supabase.removeChannel(channel)
      }
      if (unsubscribeStore) {
        unsubscribeStore()
      }
    }
  }, [])

  return null
}
