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

/*** TELL USERS TO UPLOAD RESUME, TRANSCRIPT, and COVER LETTER ON HANDSHAKE PRIOR TO USE
 * Later on create a feature to tailor the resume***/

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

// Function to wait until an element is available in the DOM
function waitForElement(selector) {
    return new Promise((resolve) => {
        const observer = new MutationObserver((mutations, observer) => {
            const element = document.querySelector(selector);
            
            if (element) {
                observer.disconnect();  // Stop observing once element is found
                resolve(element);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
}

async function selectResumeAndTranscript() {
    await delay(2000);

    const dropDowns = document.querySelectorAll('div.Select-placeholder');
    
    for (let i = 0; i < dropDowns.length; i++) {
        const dropDown = dropDowns[i];

        // Handle Cover Letter Dropdown
        if (dropDown.innerText.includes("Search your cover letters")) {
            dropDown.click();

            // Wait for input field with aria-activedescendant
            const activeInput = await waitForElement('input[aria-label="cover letters"]');
            
            if (activeInput) {
                // Extract dynamic part from aria-activedescendant
                const activeDescendant = activeInput.getAttribute('aria-activedescendant');
                
                // Use template literal to construct selector dynamically
                const coverLetterOption = await waitForElement(`div[id="${activeDescendant}"]`);
                
                if (coverLetterOption) {
                    coverLetterOption.click();
                    console.log("Selected cover letter.");
                } else {
                    console.log("No cover letter options found.");
                }
            }
        }

        // Handle Resume Dropdown
        if (dropDown.innerText.includes("Search your CVs")) {
            dropDown.click();

            // Wait for input field with aria-activedescendant
            const activeInput = await waitForElement('input[aria-label="CVs"]');
            
            if (activeInput) {
                // Extract dynamic part from aria-activedescendant
                const activeDescendant = activeInput.getAttribute('aria-activedescendant');
                
                // Use template literal to construct selector dynamically
                const resumeOption = await waitForElement(`div[id="${activeDescendant}"]`);
                
                if (resumeOption) {
                    resumeOption.click();
                    console.log("Selected resume.");
                } else {
                    console.log("No resume options found.");
                }
            }
        }

        // Handle Transcript Dropdown
        if (dropDown.innerText.includes("Search your transcripts")) {
            dropDown.click();

            // Wait for input field with aria-activedescendant
            const activeInput = await waitForElement('input[aria-label="transcripts"]');
            
            if (activeInput) {
                // Extract dynamic part from aria-activedescendant
                const activeDescendant = activeInput.getAttribute('aria-activedescendant');
                
                // Use template literal to construct selector dynamically
                const transcriptOption = await waitForElement(`div[id="${activeDescendant}"]`);
                
                if (transcriptOption) {
                    transcriptOption.click();
                    console.log("Selected transcript.");
                } else {
                    console.log("No transcript options found.");
                }
            }
        }
    }
}

async function submitApplication() {
    await delay(3000); 

    const buttons = document.querySelectorAll('button[data-hook="button"]');
    let spanner = null; // search for the submit app button

    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        if (button.innerText.includes("Submit Application")) {
            spanner = button;
            break;
        }
    }

    await selectResumeAndTranscript(); 

    if (spanner) {
        if (spanner.disabled) { // if you cant submit yet
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

//New potential app name: LaxApply
//Laxly

function populatePopups() {
    /*const popup = document.createElement('div');
    const resumeUpload = document.createElement('input');
    const transcriptUpload = document.createElement('input');
    const resumeText = document.createElement('p');
    const transcriptText = document.createElement('p');
    const textBreak = document.createElement('br');
    const finalText = document.createElement('p');

    resumeUpload.type = 'file';
    resumeUpload.accept = '.pdf';
    resumeUpload.onchange = (event) => handleFileUpload(event, 'resume');
    transcriptUpload.type = 'file';
    transcriptUpload.accept = '.pdf';
    transcriptUpload.onchange = (event) => handleFileUpload(event, 'transcript');
    resumeText.textContent = 'Upload your resume here:';
    transcriptText.textContent = 'Upload your transcript here:';
    finalText.textContent = 'Then click the green button below to swiftly auto apply!';

    popup.appendChild(resumeText);
    popup.appendChild(resumeUpload);
    popup.appendChild(transcriptText);
    popup.appendChild(transcriptUpload);
    popup.appendChild(textBreak);
    popup.appendChild(finalText);

    document.body.appendChild(popup);

    popup.style.position = 'fixed';
    popup.style.top = '100px';
    popup.style.right = '50px';
    popup.style.width = '250px';
    popup.style.height = '250px';
    popup.style.backgroundColor = '#f2f2f2';
    popup.style.padding = '20px';*/

    const runButton = document.createElement('button');
    
    runButton.textContent = "Swiftly Apply";
    runButton.onclick = paginateAndClick;

    runButton.style.position = 'fixed';
    runButton.style.bottom = '400px';
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