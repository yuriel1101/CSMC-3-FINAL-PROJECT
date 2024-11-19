document.addEventListener("DOMContentLoaded", function() {
    // Get references to the select element and all shop rows
    const sortSelect = document.querySelector('select');
    const shopContainers = document.querySelectorAll('.small-container .row');  // All rows with shops
    
    // Function to sort shops within a single container
    function sortShops(container, criteria) {
        const shops = Array.from(container.children);  // All shop divs inside the row
        let sortedShops;

        switch (criteria) {
            case "Sort by Budget":
                sortedShops = shops.sort((a, b) => {
                    return parseInt(a.getAttribute("data-budget")) - parseInt(b.getAttribute("data-budget"));
                });
                break;
            case "Sort by Location":
                sortedShops = shops.sort((a, b) => {
                    const locationA = a.querySelector('p').textContent.split(':')[1].trim();
                    const locationB = b.querySelector('p').textContent.split(':')[1].trim();
                    return locationA.localeCompare(locationB);
                });
                break;
            case "Sort by Popularity":
                sortedShops = shops.sort((a, b) => {
                    return parseInt(b.getAttribute("data-popularity")) - parseInt(a.getAttribute("data-popularity"));
                });
                break;
            case "Sort by Ratings":
                sortedShops = shops.sort((a, b) => {
                    return parseFloat(b.getAttribute("data-rating")) - parseFloat(a.getAttribute("data-rating"));
                });
                break;
            default:
                sortedShops = shops;
        }

        // Re-append sorted shops to the container
        sortedShops.forEach(shop => {
            container.appendChild(shop);  // Re-append the shop div to the container
        });
    }

    // Event listener for when the sorting option changes
    sortSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        shopContainers.forEach(container => {
            sortShops(container, selectedValue);  // Sort each row of shops
        });
    });

    // Initial sort based on the default value
    sortShops(shopContainers[0], sortSelect.value);
});
