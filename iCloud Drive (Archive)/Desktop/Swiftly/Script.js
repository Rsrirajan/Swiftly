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

paginateAndClick();