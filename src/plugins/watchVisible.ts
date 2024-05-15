// let manualPopstate: boolean = false;
// let listenerList: Array<any> = [];
// function popstateListener() {
//     let listener = listenerList.shift();
//     if (!manualPopstate) {
//         listener.that[listener.property] = false;
//     }
//     if (!listenerList.length)
//         window.removeEventListener("popstate", popstateListener);
// }
// export default function watchVisible(property:any, title:any, that:any) {
//     return function (visible:any) {
//         if (!that) that = this;
//         if (visible) {
//             window.history.pushState(
//                 { title: title, url: `#${title}` },
//                 title,
//                 `#${title}`
//             );
//             if (!listenerList.length)
//                 window.addEventListener("popstate", popstateListener);
//             listenerList.unshift({that: that, property: property});
//         } else {
//             if (window.history.state && window.history.state.title === title) {
//                 manualPopstate = true;
//                 window.history.back();
//                 manualPopstate = false;
//             }
//         }
//     };
// }
