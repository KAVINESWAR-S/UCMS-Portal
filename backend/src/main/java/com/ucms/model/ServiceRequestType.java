package com.ucms.model;

public enum ServiceRequestType {
    EB_CONNECTION("Electricity Board (EB) Connection"),
    WATER_CONNECTION("Drinking Water Pipeline Connection"),
    DRAINAGE_SEWAGE("Underground Drainage / Sewage Connection"),
    STREET_LIGHT("Street Light Installation / Pole Repair"),
    WASTE_MANAGEMENT("Sanitation & Waste Disposal Line"),
    SOLAR_ROOFTOP("Rooftop Solar Rural Grid Connection");

    private final String displayName;

    ServiceRequestType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
