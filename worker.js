self.addEventListener('push', ev => {
  const data = ev.data.json();
  var options = {
    body: data.body,
    icon: data.icon,
    data: {url: data.url},
    actions: [{action: "open_url", title: "Read more"}]
  };
  if(data.vibrate) options.vibrate = [200, 100, 200, 100, 200, 100, 200];
  self.registration.showNotification(data.title, options);
});

self.addEventListener('notificationclick', function(event) {
  switch(event.action){
    case 'open_url':
      if(event.notification.data.url !== '') clients.openWindow(event.notification.data.url);
      break;
  }
}
, false);