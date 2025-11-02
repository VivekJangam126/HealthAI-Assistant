document.addEventListener('DOMContentLoaded', () => {
    // DOTS Effect
    VANTA.DOTS({
        el: ".vanta-background",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x10B981,
        color2: 0x34D399,
        backgroundColor: 0x0F172A,
        size: 3,
        spacing: 35.00,
        showLines: false
    })

    

    // Or NET effect:
    /*
    VANTA.NET({
        el: ".vanta-background",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x10B981,
        backgroundColor: 0x0F172A,
        points: 10.00,
        maxDistance: 20.00,
        spacing: 17.00
    })
    */
});