//New potential app name: LaxApply
//Laxly

/*let resumeFile = null;
let transcriptFile = null;

function handleFileUpload(event, type) {
    const file = event.target.files[0];
    if (file) {
        if (type === 'resume') {
            resumeFile = file;
            console.log("Resume uploaded:", file.name);
        } else if (type === 'transcript') {
            transcriptFile = file;
            console.log("Transcript uploaded:", file.name);
        }
    }
}

async function uploads() {
    if (resumeFile) {
        const resumeUpload = document.querySelector('input[type="file"][accept=".pdf"]');
        if (resumeUpload) {
            resumeUpload.files = [resumeFile];
            resumeUpload.dispatchEvent(new Event('change'));
            console.log("Resume uploaded:", resumeFile.name);
        }
    }

    if (transcriptFile) {
        const transcriptUpload = document.querySelector('input[type="file"][accept=".pdf"]');
        if (transcriptUpload) {
            transcriptUpload.files = [transcriptFile];
            transcriptUpload.dispatchEvent(new Event('change'));
            console.log("Transcript uploaded:", transcriptFile.name);
        }
    }
}*/

/*** TELL USERS TO UPLOAD RESUME AND TRANSCRIPT ON HANDSHAKE PRIOR TO USE (cover letter optional)
 * Later on create a feature to tailor the resume and cover letter to the job***/

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForJobListings() {
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutations, observer) => {
            const jobListings = document.querySelectorAll('a[data-hook="jobs-card"]');
            
            if (jobListings.length > 0) {
                console.log(`${jobListings.length} job listings found.`);
                observer.disconnect();
                resolve(jobListings);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        setTimeout(() => {
            const jobListings = document.querySelectorAll('a[data-hook="jobs-card"]');
            if (jobListings.length > 0) {
                console.log(`${jobListings.length} job listings found (fallback).`);
                resolve(jobListings);
            } else {
                console.log("No job listings found after fallback timeout.");
            }
        }, 10000);
    });
}

function waitForElement(selector) {
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutations, observer) => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
}

async function selectResumeAndTranscript() {
    await delay(2000);

    const addedItems = document.querySelectorAll('div[class^="style__suggested___"]');
    
    if (addedItems.length === 0) {
        console.log("No addedItems found.");
        return;
    } else {
        console.log(`${addedItems.length} addedItems found.`);
    }

    let resumeSelected = false;
    let transcriptSelected = false;

    for (let i = 0; i < addedItems.length; i++) {
        const addedItem = addedItems[i];

        const options = addedItem.querySelectorAll('button[data-hook="pill"]');

        if (!resumeSelected && options[0].innerText.includes("Resume")) {
            options[0].click();
            console.log("Selected most recent resume.");
            resumeSelected = true;
        }

        if (!transcriptSelected && options[0].innerText.includes("Transcript")) {
            options[0].click();
            console.log("Selected most recent transcript.");
            transcriptSelected = true;
        }

        if (resumeSelected && transcriptSelected) break;
    }
}

async function submitApplication() {
    await delay(3000); 

    const buttons = document.querySelectorAll('button[data-hook="button"]');
    let spanner = null;

    // Search for the submit application button
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        if (button.innerText.includes("Submit Application")) {
            spanner = button;
            break;
        }
    }

    await selectResumeAndTranscript(); 

    if (spanner) {
        if (spanner.disabled) { 
            const closeOut = document.querySelector('button[aria-label="dismiss"]');
            if (closeOut) {
                closeOut.click();
                console.log("Closed the modal.");
            } else {
                console.log("Close icon not found.");
            }
        } else {
            spanner.click();
            console.log("Submitted application.");
        }
    } else {
        console.log("Submit Application button not found.");
    }

    await delay(2000);
}

async function clickApply() {
    await delay(2000);

    const jobPreview = document.querySelector('div[data-hook="details-pane"][aria-label="Job Preview"]');
    if (jobPreview) {
        console.log("Job Preview pane found.");

        const applyButton = jobPreview.querySelector('button[aria-label="Apply"]');

        if (applyButton) {
            console.log("Apply button found.");
            applyButton.click();
            console.log("Clicked on Apply button");
            await submitApplication();
        } else {
            console.log("No Apply button found.");
        }
    } else {
        console.log("Job Preview pane not found.");
    }

    await delay(2000);
}

async function clickJobListings() {
    const jobListings = await waitForJobListings();

    for (let i = 0; i < jobListings.length; i++) {
        const clickableLink = jobListings[i];

        if (clickableLink) {
            clickableLink.scrollIntoView({ behavior: 'smooth', block: 'center' });

            clickableLink.click();
            console.log("Clicked on job listing:", clickableLink);

            await delay(2000);
            await clickApply();
        } else {
            console.log("No clickable link found for this job listing.");
        }
    }
}

async function paginateAndClick() {
    let hasMorePages = true;

    while (hasMorePages) {
        await clickJobListings();

        let nextPageButton = document.querySelector('button[data-hook="search-pagination-next"][aria-label="next page"]');
        
        if (nextPageButton && !nextPageButton.disabled) {
            console.log("Next Page button found.");

            nextPageButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            nextPageButton.click();
            console.log("Clicked on Next Page button");

            await delay(5000); 

        } else {
            console.log("No more pages left or Next Page button disabled.");
            hasMorePages = false;
        }
    }
}

// Function to create and display a "Swiftly Apply" button
function populatePopups() {    
    const runButton = document.createElement('button');
    
    runButton.textContent = "Swiftly Apply";
    runButton.onclick = paginateAndClick;

    runButton.style.position = 'fixed';
    runButton.style.bottom = '200px';
    runButton.style.right = '20px';
    runButton.style.padding = '10px 20px';
    runButton.style.backgroundColor = '#4CAF50';
    runButton.style.color = 'white';
    runButton.style.border = 'none';
    runButton.style.borderRadius = '5px';
    runButton.style.cursor = 'pointer';

    document.body.appendChild(runButton);
} 

populatePopups();
//figure out how to trigger on load and not just by reloading the page
