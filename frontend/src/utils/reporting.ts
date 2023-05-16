import { getCSRFToken } from "./getCSRFToken";

// Returns bounding box of given element w.r.t. viewport
function getElementBoundingBox(element: HTMLElement) {
    let x = element.getBoundingClientRect();
    return {
        "left": x.left,
        "top": x.top,
        "width": x.width,
        "height": x.height
    };
}

function getViewportBoundingBox() {
    return getElementBoundingBox(document.documentElement);
}

// Returns context, something that is relevant for most of the reported status and that makes
// sense to accompany reported information
function getContext(extra="") {
    return {
        "url": window.location.href,
        "time": new Date().toISOString(),
        "viewport": getViewportBoundingBox(),
        "extra": extra
    };
}

// function reportViewportChange(endpoint: string, extraCtxLambda=()=>"") {
//     const data = {
//         "viewport": getViewportBoundingBox(),
//         "screen_sizes": getScreenSizes(),
//         "context": getContext(extraCtxLambda())
//     }
//     return fetch(endpoint,
//         {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': csrfToken
//             },
//             body: JSON.stringify(data),
//             redirect: "follow"
//         }
//     )
// }

// // Starts listening for viewport changes and posts them to the given endpoint
// // initialReport parameter allow us to report about current values
// // (this is especially useful if we want to report initial viewport dimensions, before any user action)
// function startViewportChangeReporting(endpoint, initialReport=true, extraCtxLambda=()=>"") {
    
//     if (initialReport === true) {
//         window.addEventListener("load", function(e) {
//             reportViewportChange(endpoint, extraCtxLambda);
//         });
//     }

//     window.addEventListener("scroll", function(e) {
//         reportViewportChange(endpoint, extraCtxLambda);
//     });

//     window.addEventListener("resize", function(e) {
//         reportViewportChange(endpoint, extraCtxLambda);
//     });
// }


// // Starts listening for viewport changes and posts them to the given endpoint
// // initialReport parameter allow us to report about current values
// // (this is especially useful if we want to report initial viewport dimensions, before any user action)
// function startViewportChangeReportingWithLimit(endpoint, csrfToken, timeLimitSeconds, initialReport=true, extraCtxLambda=()=>"") {
//     if (initialReport === true) {
//         window.addEventListener("load", function(e) {
//             reportViewportChange(endpoint,  extraCtxLambda);
//         });
//     }

//     let lastReported = +new Date();
//     let lastReportedViaResize = +new Date();

//     window.addEventListener("scroll", function(e) {
//         let now = +new Date();
//         if ((now - lastReported) / 1000 > timeLimitSeconds) {
//             reportViewportChange(endpoint, extraCtxLambda);
//             lastReported = now;
//         }
//     });

//     window.addEventListener("resize", function(e) {
//         let now = +new Date();
//         if ((now - lastReportedViaResize) / 1000 > timeLimitSeconds) {
//             reportViewportChange(endpoint, extraCtxLambda);
//             lastReportedViaResize = now;
//         }
//     });
// }

// // Starts listening for scrolling and posts them to the given endpoint
// // initialReport parameter allow us to report about current values
// // (this is especially useful if we want to report initial viewport dimensions, before any user action)
// // This overloads also accepts elements on which we listen for scroll events
// function startScrollReportingWithLimit(endpoint, csrfToken, timeLimitSeconds, elements, extraCtxLambda=()=>"") {
//     var lastReported = new Date();
//     for (let i = 0; i < elements.length; ++i) {
//         elements[i].addEventListener("scroll", function(e) {
//             let now = new Date();
//             if ((now - lastReported) / 1000 > timeLimitSeconds) {
//                 reportViewportChange(endpoint, csrfToken, extraCtxLambda);
//                 lastReported = now;
//             }
//         });
//     }
// }

// // Used for reporting clicked buttons, options, checkboxes, ratings, etc.
// function reportOnInput(endpoint, inputType, data, extraCtxLambda=()=>"") {
//     data["context"] = getContext(extraCtxLambda());
//     data["input_type"] = inputType;
//     fetch(endpoint,
//         {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': csrfToken
//             },
//             body: JSON.stringify(data),
//             redirect: "follow"
//         }
//     );
// }

// function registerClickedButtonReporting(endpoint, csrfToken, btns, extraCtxLambda=()=>"") { 
//     btns.forEach(btn => {
//         btn.addEventListener('click', event => {
//             let data = {
//                 "id": event.target.id,
//                 "text": event.target.textContent,
//                 "name": event.target.name
//             };
//             reportOnInput(endpoint, csrfToken, "button", data, extraCtxLambda);
//         });
//     });
// }

// function registerClickedCheckboxReporting(endpoint, csrfToken, checkboxes, extraCtxLambda=()=>"") {
//     checkboxes.forEach(checkbox => {
//         checkbox.addEventListener('click', event => {
//             let data = {
//                 "id": event.target.id,
//                 "checked": event.target.checked,
//                 "name": event.target.name
//             };
//             reportOnInput(endpoint, csrfToken, "checkbox", data, extraCtxLambda);
//         });
//     });
// }

// function registerClickedRadioReporting(endpoint, csrfToken, radios, extraCtxLambda=()=>"") {
//     radios.forEach(radio => {
//         radio.addEventListener('click', event => {
//             let data = {
//                 "id": event.target.id,
//                 "value": event.target.value,
//                 "name": event.target.name
//             };
//             reportOnInput(endpoint, csrfToken, "radio", data, extraCtxLambda);
//         });
//     });
// }

// function reportLoadedPage(endpoint, pageName, extraCtxLambda=()=>"") {
//     data = {
//         "page": pageName,
//         "context": getContext(extraCtxLambda())
//     };
//     return fetch(endpoint,
//         {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-CSRFToken': csrfToken
//             },
//             body: JSON.stringify(data),
//             redirect: "follow"
//         }
//     )
// }

export async function reportSelectedItem(selectedItems: any[], { selectedItem, deselectedItem }: { selectedItem: string, deselectedItem: never } | { deselectedItem: string, selectedItem: never }) {
    const data = {
        ...(
            selectedItem ? {
                "selected_item": selectedItem,
            }
            : {
                "deselected_item": deselectedItem,
            }),
        "selected_items": selectedItems,
        "context": getContext()
    };
    return fetch(`http://localhost:5555/utils/${selectedItem ? 'selected' : 'deselected'}-item`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': await getCSRFToken(),
            },
            body: JSON.stringify(data),
            redirect: "follow",
            credentials: 'include'
        }
    )
}
