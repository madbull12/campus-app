import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { BackgroundSyncQueue, Serwist } from "serwist";
// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;
self.skipWaiting();

self.addEventListener("activate", () => self.clients.claim());

self.addEventListener('push', (event) => {
  console.log('testt')
  // const notification = event.data?.json();
  // const {
  //   title, body, icon
  // } = notification;

  // console.log("testt")
  // async function handlePushEvent() {
  //   const windowClients = await self.clients.matchAll({
  //     type:"window"
  //   });

  //   if(windowClients.length >0) {
  //     const appInForeground = windowClients.some(client=>client.focused);
  //     if(appInForeground) {
  //       console.log("App is in foreground, don't show notification");
  //       return;
  //     }
  //   }
  //   await self.registration.showNotification(title,{
  //     body,
  //     icon,
  //     renotify:true,
  //     data:{
  //       title
  //     }
      
  //   } as NotificationOptions )
  // }

  // event.waitUntil(handlePushEvent())
});

const queue = new BackgroundSyncQueue("myQueueName");
const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: '/offline', // the page that'll display if user goes offline
        matcher({ request }) {
          return request.destination === 'document';
        },
      },
    ],
  },
});


serwist.addEventListeners();


