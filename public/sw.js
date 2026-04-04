// Minimal Service Worker for Web Push Notifications

self.addEventListener('push', function (event) {
  if (event.data) {
    try {
      const data = event.data.json()
      
      const options = {
        body: data.body || 'You have a new notification.',
        icon: data.icon || '/rhythme_z_o.png',
        badge: data.badge || '/rhythme.png',
        data: data.url || '/',
      }

      event.waitUntil(
        self.registration.showNotification(data.title || 'New Notification', options)
      )
    } catch (err) {
      const options = {
        body: event.data.text(),
        icon: '/rhythme_z_o.png',
      }
      event.waitUntil(
        self.registration.showNotification('New Notification', options)
      )
    }
  }
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()

  const urlToOpen = event.notification.data || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i]
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})
