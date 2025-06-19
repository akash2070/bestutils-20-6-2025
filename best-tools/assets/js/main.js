/**
 * Multi Calculators - Main JavaScript
 * Version: 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize SVG icons using Feather Icons if available
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Initialize Mobile Navigation
    initMobileNavigation();
    
    // Common utility functions
    const MultiCalc = {
        // Show a result container
        showResult: function(resultId) {
            const resultElement = document.getElementById(resultId);
            if (resultElement) {
                resultElement.style.display = 'block';
                resultElement.classList.add('visible');
                // Smooth scroll to result
                resultElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        },
        
        // Hide a result container
        hideResult: function(resultId) {
            const resultElement = document.getElementById(resultId);
            if (resultElement) {
                resultElement.style.display = 'none';
                resultElement.classList.remove('visible');
            }
        },
        
        // Format number with commas
        formatNumber: function(number) {
            return new Intl.NumberFormat().format(number);
        },
        
        // Validate number input
        isValidNumber: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },
        
        // Format as currency
        formatCurrency: function(amount, currency = 'USD') {
            return new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(amount);
        },
        
        // Get element value and convert to number
        getNumberValue: function(elementId) {
            const element = document.getElementById(elementId);
            if (!element) return 0;
            const value = parseFloat(element.value);
            return isNaN(value) ? 0 : value;
        },
        
        // Set text content of an element
        setText: function(elementId, text) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = text;
            }
        },
        
        // Show error message
        showError: function(elementId, message) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = message;
                element.style.display = 'block';
                element.classList.add('error');
            }
        },
        
        // Hide error message
        hideError: function(elementId) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = '';
                element.style.display = 'none';
                element.classList.remove('error');
            }
        }
    };
    
    // Expose utility functions globally
    window.MultiCalc = MultiCalc;
    
    // Detect and initialize tool-specific functionality
    const toolInitializers = {
        // Age Calculator
        initAgeCalculator: function() {
            const calculateAgeBtn = document.getElementById('calculate-age-btn');
            if (!calculateAgeBtn) return;
            
            calculateAgeBtn.addEventListener('click', function() {
                const birthDateInput = document.getElementById('birth-date');
                const resultElement = document.getElementById('age-result');
                
                if (!birthDateInput || !birthDateInput.value) {
                    MultiCalc.showError('age-calculator-error', 'Please enter a valid birth date');
                    return;
                }
                
                MultiCalc.hideError('age-calculator-error');
                
                const birthDate = new Date(birthDateInput.value);
                const today = new Date();
                
                let ageYears = today.getFullYear() - birthDate.getFullYear();
                let ageMonths = today.getMonth() - birthDate.getMonth();
                let ageDays = today.getDate() - birthDate.getDate();
                
                if (ageDays < 0) {
                    ageMonths--;
                    // Days in previous month
                    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                    ageDays += lastMonth.getDate();
                }
                
                if (ageMonths < 0) {
                    ageYears--;
                    ageMonths += 12;
                }
                
                document.getElementById('age-years').textContent = ageYears;
                document.getElementById('age-months').textContent = ageMonths;
                document.getElementById('age-days').textContent = ageDays;
                
                MultiCalc.showResult('age-result');
            });
        },
        
        // BMI Calculator
        initBmiCalculator: function() {
            const calculateBmiBtn = document.getElementById('calculate-bmi-btn');
            if (!calculateBmiBtn) return;
            
            calculateBmiBtn.addEventListener('click', function() {
                const weight = MultiCalc.getNumberValue('weight');
                const height = MultiCalc.getNumberValue('height');
                const heightUnit = document.getElementById('height-unit').value;
                const weightUnit = document.getElementById('weight-unit').value;
                
                if (weight <= 0 || height <= 0) {
                    MultiCalc.showError('bmi-calculator-error', 'Please enter valid height and weight values');
                    return;
                }
                
                MultiCalc.hideError('bmi-calculator-error');
                
                // Convert to metric if needed
                let weightKg = weight;
                if (weightUnit === 'lb') {
                    weightKg = weight * 0.453592;
                }
                
                let heightM = height;
                if (heightUnit === 'cm') {
                    heightM = height / 100;
                } else if (heightUnit === 'in') {
                    heightM = height * 0.0254;
                } else if (heightUnit === 'ft') {
                    heightM = height * 0.3048;
                }
                
                // Calculate BMI
                const bmi = weightKg / (heightM * heightM);
                
                document.getElementById('bmi-value').textContent = bmi.toFixed(2);
                
                // Determine BMI category
                let category = '';
                if (bmi < 18.5) {
                    category = 'Underweight';
                } else if (bmi < 25) {
                    category = 'Normal weight';
                } else if (bmi < 30) {
                    category = 'Overweight';
                } else {
                    category = 'Obesity';
                }
                
                document.getElementById('bmi-category').textContent = category;
                
                MultiCalc.showResult('bmi-result');
            });
        },
        
        // Percentage Calculator
        initPercentageCalculator: function() {
            const calculatePercentBtn = document.getElementById('calculate-percent-btn');
            if (!calculatePercentBtn) return;
            
            calculatePercentBtn.addEventListener('click', function() {
                const calculationType = document.getElementById('percent-calc-type').value;
                
                if (calculationType === 'percent-of') {
                    // Calculate X% of Y
                    const percent = MultiCalc.getNumberValue('percent-value');
                    const total = MultiCalc.getNumberValue('total-value');
                    
                    if (percent === 0 || total === 0) {
                        MultiCalc.showError('percentage-calculator-error', 'Please enter valid values');
                        return;
                    }
                    
                    const result = (percent / 100) * total;
                    
                    document.getElementById('percent-result-text').textContent = 
                        `${percent}% of ${total} = ${result.toFixed(2)}`;
                    
                } else if (calculationType === 'percent-change') {
                    // Calculate percent change from X to Y
                    const oldValue = MultiCalc.getNumberValue('old-value');
                    const newValue = MultiCalc.getNumberValue('new-value');
                    
                    if (oldValue === 0) {
                        MultiCalc.showError('percentage-calculator-error', 'Initial value cannot be zero');
                        return;
                    }
                    
                    const change = newValue - oldValue;
                    const percentChange = (change / Math.abs(oldValue)) * 100;
                    
                    document.getElementById('percent-result-text').textContent = 
                        `Percentage change: ${percentChange.toFixed(2)}%`;
                    
                } else if (calculationType === 'percent-value') {
                    // Calculate X is what percent of Y
                    const part = MultiCalc.getNumberValue('part-value');
                    const whole = MultiCalc.getNumberValue('whole-value');
                    
                    if (whole === 0) {
                        MultiCalc.showError('percentage-calculator-error', 'Total value cannot be zero');
                        return;
                    }
                    
                    const percentage = (part / whole) * 100;
                    
                    document.getElementById('percent-result-text').textContent = 
                        `${part} is ${percentage.toFixed(2)}% of ${whole}`;
                }
                
                MultiCalc.hideError('percentage-calculator-error');
                MultiCalc.showResult('percentage-result');
            });
            
            // Show/hide appropriate input fields based on calculation type
            const percentCalcType = document.getElementById('percent-calc-type');
            if (percentCalcType) {
                percentCalcType.addEventListener('change', function() {
                    const calculationType = this.value;
                    
                    document.getElementById('percent-of-inputs').style.display = 
                        calculationType === 'percent-of' ? 'block' : 'none';
                    
                    document.getElementById('percent-change-inputs').style.display = 
                        calculationType === 'percent-change' ? 'block' : 'none';
                    
                    document.getElementById('percent-value-inputs').style.display = 
                        calculationType === 'percent-value' ? 'block' : 'none';
                });
            }
        },
        
        // Unit Converter
        initUnitConverter: function() {
            const convertBtn = document.getElementById('convert-unit-btn');
            const unitTypeSelect = document.getElementById('unit-type');
            
            if (!convertBtn || !unitTypeSelect) return;
            
            // Update from/to unit options when unit type changes
            unitTypeSelect.addEventListener('change', function() {
                const unitType = this.value;
                const fromUnitSelect = document.getElementById('from-unit');
                const toUnitSelect = document.getElementById('to-unit');
                
                // Clear existing options
                fromUnitSelect.innerHTML = '';
                toUnitSelect.innerHTML = '';
                
                let options = [];
                
                switch(unitType) {
                    case 'length':
                        options = [
                            {value: 'mm', text: 'Millimeters (mm)'},
                            {value: 'cm', text: 'Centimeters (cm)'},
                            {value: 'm', text: 'Meters (m)'},
                            {value: 'km', text: 'Kilometers (km)'},
                            {value: 'in', text: 'Inches (in)'},
                            {value: 'ft', text: 'Feet (ft)'},
                            {value: 'yd', text: 'Yards (yd)'},
                            {value: 'mi', text: 'Miles (mi)'}
                        ];
                        break;
                    case 'weight':
                        options = [
                            {value: 'mg', text: 'Milligrams (mg)'},
                            {value: 'g', text: 'Grams (g)'},
                            {value: 'kg', text: 'Kilograms (kg)'},
                            {value: 'oz', text: 'Ounces (oz)'},
                            {value: 'lb', text: 'Pounds (lb)'},
                            {value: 'st', text: 'Stone (st)'},
                            {value: 't', text: 'Tons (t)'}
                        ];
                        break;
                    case 'volume':
                        options = [
                            {value: 'ml', text: 'Milliliters (ml)'},
                            {value: 'l', text: 'Liters (l)'},
                            {value: 'c', text: 'Cups (c)'},
                            {value: 'pt', text: 'Pints (pt)'},
                            {value: 'qt', text: 'Quarts (qt)'},
                            {value: 'gal', text: 'Gallons (gal)'}
                        ];
                        break;
                    case 'temperature':
                        options = [
                            {value: 'c', text: 'Celsius (°C)'},
                            {value: 'f', text: 'Fahrenheit (°F)'},
                            {value: 'k', text: 'Kelvin (K)'}
                        ];
                        break;
                    case 'area':
                        options = [
                            {value: 'sqm', text: 'Square Meters (m²)'},
                            {value: 'sqkm', text: 'Square Kilometers (km²)'},
                            {value: 'sqft', text: 'Square Feet (ft²)'},
                            {value: 'sqyd', text: 'Square Yards (yd²)'},
                            {value: 'acre', text: 'Acres'},
                            {value: 'ha', text: 'Hectares (ha)'}
                        ];
                        break;
                }
                
                // Add options to selects
                options.forEach(function(option) {
                    const fromOption = document.createElement('option');
                    fromOption.value = option.value;
                    fromOption.textContent = option.text;
                    fromUnitSelect.appendChild(fromOption);
                    
                    const toOption = document.createElement('option');
                    toOption.value = option.value;
                    toOption.textContent = option.text;
                    toUnitSelect.appendChild(toOption);
                });
                
                // Set different default selections
                if (options.length > 1) {
                    toUnitSelect.selectedIndex = 1;
                }
            });
            
            // Trigger change to populate initial options
            const event = new Event('change');
            unitTypeSelect.dispatchEvent(event);
            
            // Conversion logic
            convertBtn.addEventListener('click', function() {
                const unitType = unitTypeSelect.value;
                const fromUnit = document.getElementById('from-unit').value;
                const toUnit = document.getElementById('to-unit').value;
                const inputValue = MultiCalc.getNumberValue('unit-input-value');
                
                if (inputValue === 0 && unitType !== 'temperature') {
                    MultiCalc.showError('unit-converter-error', 'Please enter a valid value to convert');
                    return;
                }
                
                MultiCalc.hideError('unit-converter-error');
                
                let result = 0;
                
                // Convert to base unit first, then to target unit
                if (unitType === 'length') {
                    // Convert to meters first
                    let valueInMeters = 0;
                    switch(fromUnit) {
                        case 'mm': valueInMeters = inputValue / 1000; break;
                        case 'cm': valueInMeters = inputValue / 100; break;
                        case 'm': valueInMeters = inputValue; break;
                        case 'km': valueInMeters = inputValue * 1000; break;
                        case 'in': valueInMeters = inputValue * 0.0254; break;
                        case 'ft': valueInMeters = inputValue * 0.3048; break;
                        case 'yd': valueInMeters = inputValue * 0.9144; break;
                        case 'mi': valueInMeters = inputValue * 1609.34; break;
                    }
                    
                    // Convert from meters to target unit
                    switch(toUnit) {
                        case 'mm': result = valueInMeters * 1000; break;
                        case 'cm': result = valueInMeters * 100; break;
                        case 'm': result = valueInMeters; break;
                        case 'km': result = valueInMeters / 1000; break;
                        case 'in': result = valueInMeters / 0.0254; break;
                        case 'ft': result = valueInMeters / 0.3048; break;
                        case 'yd': result = valueInMeters / 0.9144; break;
                        case 'mi': result = valueInMeters / 1609.34; break;
                    }
                } else if (unitType === 'weight') {
                    // Convert to grams first
                    let valueInGrams = 0;
                    switch(fromUnit) {
                        case 'mg': valueInGrams = inputValue / 1000; break;
                        case 'g': valueInGrams = inputValue; break;
                        case 'kg': valueInGrams = inputValue * 1000; break;
                        case 'oz': valueInGrams = inputValue * 28.3495; break;
                        case 'lb': valueInGrams = inputValue * 453.592; break;
                        case 'st': valueInGrams = inputValue * 6350.29; break;
                        case 't': valueInGrams = inputValue * 1000000; break;
                    }
                    
                    // Convert from grams to target unit
                    switch(toUnit) {
                        case 'mg': result = valueInGrams * 1000; break;
                        case 'g': result = valueInGrams; break;
                        case 'kg': result = valueInGrams / 1000; break;
                        case 'oz': result = valueInGrams / 28.3495; break;
                        case 'lb': result = valueInGrams / 453.592; break;
                        case 'st': result = valueInGrams / 6350.29; break;
                        case 't': result = valueInGrams / 1000000; break;
                    }
                } else if (unitType === 'volume') {
                    // Convert to milliliters first
                    let valueInMl = 0;
                    switch(fromUnit) {
                        case 'ml': valueInMl = inputValue; break;
                        case 'l': valueInMl = inputValue * 1000; break;
                        case 'c': valueInMl = inputValue * 236.588; break;
                        case 'pt': valueInMl = inputValue * 473.176; break;
                        case 'qt': valueInMl = inputValue * 946.353; break;
                        case 'gal': valueInMl = inputValue * 3785.41; break;
                    }
                    
                    // Convert from milliliters to target unit
                    switch(toUnit) {
                        case 'ml': result = valueInMl; break;
                        case 'l': result = valueInMl / 1000; break;
                        case 'c': result = valueInMl / 236.588; break;
                        case 'pt': result = valueInMl / 473.176; break;
                        case 'qt': result = valueInMl / 946.353; break;
                        case 'gal': result = valueInMl / 3785.41; break;
                    }
                } else if (unitType === 'temperature') {
                    // Direct conversion for each combination
                    if (fromUnit === toUnit) {
                        result = inputValue;
                    } else if (fromUnit === 'c' && toUnit === 'f') {
                        result = (inputValue * 9/5) + 32;
                    } else if (fromUnit === 'c' && toUnit === 'k') {
                        result = inputValue + 273.15;
                    } else if (fromUnit === 'f' && toUnit === 'c') {
                        result = (inputValue - 32) * 5/9;
                    } else if (fromUnit === 'f' && toUnit === 'k') {
                        result = (inputValue - 32) * 5/9 + 273.15;
                    } else if (fromUnit === 'k' && toUnit === 'c') {
                        result = inputValue - 273.15;
                    } else if (fromUnit === 'k' && toUnit === 'f') {
                        result = (inputValue - 273.15) * 9/5 + 32;
                    }
                } else if (unitType === 'area') {
                    // Convert to square meters first
                    let valueInSqM = 0;
                    switch(fromUnit) {
                        case 'sqm': valueInSqM = inputValue; break;
                        case 'sqkm': valueInSqM = inputValue * 1000000; break;
                        case 'sqft': valueInSqM = inputValue * 0.092903; break;
                        case 'sqyd': valueInSqM = inputValue * 0.836127; break;
                        case 'acre': valueInSqM = inputValue * 4046.86; break;
                        case 'ha': valueInSqM = inputValue * 10000; break;
                    }
                    
                    // Convert from square meters to target unit
                    switch(toUnit) {
                        case 'sqm': result = valueInSqM; break;
                        case 'sqkm': result = valueInSqM / 1000000; break;
                        case 'sqft': result = valueInSqM / 0.092903; break;
                        case 'sqyd': result = valueInSqM / 0.836127; break;
                        case 'acre': result = valueInSqM / 4046.86; break;
                        case 'ha': result = valueInSqM / 10000; break;
                    }
                }
                
                // Round to appropriate decimal places based on magnitude
                let formattedResult;
                if (Math.abs(result) >= 1000) {
                    formattedResult = result.toFixed(2);
                } else if (Math.abs(result) >= 10) {
                    formattedResult = result.toFixed(3);
                } else if (Math.abs(result) >= 0.1) {
                    formattedResult = result.toFixed(4);
                } else {
                    formattedResult = result.toFixed(5);
                }
                
                // Remove trailing zeros
                formattedResult = parseFloat(formattedResult).toString();
                
                document.getElementById('unit-result-value').textContent = formattedResult;
                document.getElementById('unit-result-from').textContent = document.getElementById('from-unit').options[document.getElementById('from-unit').selectedIndex].text;
                document.getElementById('unit-result-to').textContent = document.getElementById('to-unit').options[document.getElementById('to-unit').selectedIndex].text;
                
                MultiCalc.showResult('unit-conversion-result');
            });
        },

        // Initialize all other calculators
        // Will be implemented for each tool in its respective template
    };
    
    // Initialize all tools
    Object.keys(toolInitializers).forEach(function(key) {
        if (typeof toolInitializers[key] === 'function') {
            toolInitializers[key]();
        }
    });

    // Live filtering for Explore Tools search bar
    const exploreSearchBox = document.getElementById('exploreSearchBox');
    if (exploreSearchBox) {
        exploreSearchBox.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            // Get all tool-tag links in the categories grid
            const allToolTags = document.querySelectorAll('.category-tools .tool-tag');
            if (query === '') {
                // Show all tool tags
                allToolTags.forEach(tag => {
                    tag.style.display = '';
                });
                // Show all category cards
                document.querySelectorAll('.category-card').forEach(card => {
                    card.style.display = '';
                });
                return;
            }
            // Hide all tool tags initially
            allToolTags.forEach(tag => {
                const text = tag.textContent.toLowerCase();
                if (text.includes(query)) {
                    tag.style.display = '';
                } else {
                    tag.style.display = 'none';
                }
            });
            // Hide category cards with no visible tools
            document.querySelectorAll('.category-card').forEach(card => {
                const visible = card.querySelectorAll('.tool-tag:not([style*="display: none"])').length > 0;
                card.style.display = visible ? '' : 'none';
            });
        });
    }
});

// Mobile Navigation Functionality
function initMobileNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    if (!mobileMenuToggle || !navMenu) return;

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle dropdown toggles on mobile
    dropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(event) {
            // Only handle clicks on mobile
            if (window.innerWidth <= 768) {
                event.preventDefault();

                const dropdown = this.closest('.dropdown');
                const isActive = dropdown.classList.contains('active');

                // Close all other dropdowns
                document.querySelectorAll('.dropdown').forEach(function(item) {
                    item.classList.remove('active');
                });

                // Toggle current dropdown
                if (!isActive) {
                    dropdown.classList.add('active');
                }
            }
        });
    });

    // Close mobile menu when window is resized to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';

            // Remove active state from all dropdowns
            document.querySelectorAll('.dropdown').forEach(function(item) {
                item.classList.remove('active');
            });
        }
    });

    // Handle search functionality
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();

            if (searchTerm.length > 2) {
                // Simple search functionality - you can enhance this
                console.log('Searching for:', searchTerm);
                // Add your search logic here
            }
        });
    }
}
