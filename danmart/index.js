document.addEventListener("DOMContentLoaded", function () {
    const productsContainer = document.querySelector(".products");
    const products = Array.from(productsContainer.getElementsByClassName("product-display"));
    let itemsPerPage = calculateItemsPerPage(); // Products per page
    let currentPage = 1;
    const maxPages = Math.ceil(products.length / itemsPerPage);
    const pageNumbersContainer = document.getElementById("pageNumbers");

    // Function to calculate items per page based on container width
    function calculateItemsPerPage() {
        const containerWidth = productsContainer.offsetWidth;
        const itemWidth = products[0].offsetWidth; // Assuming all items have the same width
        const itemsPerRow = Math.floor(containerWidth / itemWidth);
        const rowsPerPage = Math.floor(window.innerHeight / (products[0].offsetHeight + 20)); // Adjust for spacing
        return itemsPerRow * rowsPerPage;
    }


    function showPage(page) {
        currentPage = page;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        // Show only relevant products
        products.forEach((product, index) => {
            product.style.display = index >= start && index < end ? "flex" : "none";
        });

        // Update pagination
        document.getElementById("prevPage").disabled = (page === 1);
        document.getElementById("nextPage").disabled = (page === maxPages);
        
        createPaginationButtons(); // Regenerate pagination numbers
    }

    function createPaginationButtons() {
        pageNumbersContainer.innerHTML = ""; // Clear existing buttons

        let pagesToShow = [];
        
        if (maxPages <= 7) {
            // Show all pages if <= 7 pages
            pagesToShow = [...Array(maxPages).keys()].map(i => i + 1);
        } else {
            // Show first, last, and some middle pages
            if (currentPage <= 4) {
                pagesToShow = [1, 2, 3, 4, 5, "...", maxPages];
            } else if (currentPage >= maxPages - 3) {
                pagesToShow = [1, "...", maxPages - 4, maxPages - 3, maxPages - 2, maxPages - 1, maxPages];
            } else {
                pagesToShow = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", maxPages];
            }
        }

        pagesToShow.forEach(page => {
            let pageBtn = document.createElement("button");
            pageBtn.classList.add("page-btn");
            pageBtn.textContent = page;
            pageBtn.setAttribute("data-page", page);
            
            if (page === "...") {
                pageBtn.disabled = true; // Disable ellipsis button
                pageBtn.style.cursor = "default";
            } else {
                pageBtn.addEventListener("click", function () {
                    showPage(parseInt(page));
                });

                if (page === currentPage) {
                    pageBtn.classList.add("active");
                }
            }

            pageNumbersContainer.appendChild(pageBtn);
        });
    }

    document.getElementById("prevPage").addEventListener("click", function () {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });

    document.getElementById("nextPage").addEventListener("click", function () {
        if (currentPage < maxPages) {
            showPage(currentPage + 1);
        }
    });

    // window.addEventListener("resize", function () {
    //     itemsPerPage = calculateItemsPerPage();
    //     showPage(1); // Reset to the first page
    // });

    createPaginationButtons();
    showPage(currentPage); // Initial display
});

document.getElementById("calculate").addEventListener("click", function () {
    try {
        const weight = parseFloat(document.getElementById("weight").value);
        const height = parseFloat(document.getElementById("height").value);
        const result = document.getElementById("result");

        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            throw new Error("Please enter valid weight and height.");
        }

        if (height > 2.5) {
            throw new Error("Height cannot be more than 2.5m.");
        }

        const bmi = (weight / (height * height)).toFixed(2);

        let category = "";
        if (bmi < 18.5) category = "Underweight";
        else if (bmi >= 18.5 && bmi < 24.9) category = "Normal weight";
        else if (bmi >= 25 && bmi < 29.9) category = "Overweight";
        else category = "Obese";

        result.textContent = `Your BMI: ${bmi} (${category})`;
        result.style.color = "#333";
    } catch (error) {
        document.getElementById("result").textContent = error.message;
        document.getElementById("result").style.color = "red";
    }
});


document.getElementById("aboutLink").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default anchor behavior

    const aboutSection = document.getElementById("about");
    const headerHeight = document.querySelector("header").offsetHeight;

    // Scroll to the section, accounting for the fixed header height
    window.scrollTo({
        top: aboutSection.offsetTop - headerHeight,
        behavior: "smooth", // Smooth scrolling
    });
});