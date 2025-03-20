/**
 * Fetches repositories of a given GitHub user.
 * @param {string} username - GitHub username to fetch repositories for.
 */
async function fetchRepositories(username) {
    // GitHub API URL to fetch user repositories
    const url = `https://api.github.com/users/${username}/repos`;
    
    try {
        // Fetch the data from the API
        const response = await fetch(url);

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }
        
        // Parse the response JSON data
        const repositories = await response.json();

        // Display the fetched repositories in the UI
        displayRepositories(repositories);
    } catch (error) {
        console.error("Error fetching repositories:", error);
        alert("Failed to fetch repositories. Please check the username and try again.");
    }
}

/**
 * Displays the repositories in the UI.
 * @param {Array} repos - List of repositories retrieved from GitHub API.
 */
function displayRepositories(repos) {
    const gallery = document.getElementById("repo-gallery");

    // Clear any previous search results
    gallery.innerHTML = "";

    // Check if no repositories were found
    if (repos.length === 0) {
        gallery.innerHTML = "<p>No repositories found.</p>";
        return;
    }

    // Display up to 20 repositories
    repos.slice(0, 20).forEach(repo => {
        // Create a new div element for each repository
        const repoCard = document.createElement("div");
        repoCard.classList.add("repo-card");

        // Add repository details to the card
        repoCard.innerHTML = `
            <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
            <p>${repo.description || "No description available"}</p>
            <p><strong>Created:</strong> ${new Date(repo.created_at).toLocaleDateString()}</p>
            <p><strong>Updated:</strong> ${new Date(repo.updated_at).toLocaleDateString()}</p>
            <p><strong>Watchers:</strong> ${repo.watchers}</p>
        `;

        // Append the repository card to the gallery
        gallery.appendChild(repoCard);
    });
}

/**
 * Handles the search functionality when the user enters a username.
 */
function searchUser() {
    // Get the username entered by the user
    const username = document.getElementById("username").value.trim();

    // Check if the input is not empty
    if (username) {
        fetchRepositories(username);
    } else {
        alert("Please enter a GitHub username!");
    }
}
