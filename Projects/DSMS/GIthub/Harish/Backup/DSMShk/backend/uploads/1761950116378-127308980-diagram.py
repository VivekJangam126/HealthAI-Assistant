import pandas as pd
import matplotlib.pyplot as plt

# Data provided in the prompt
data = {
    'Message Type': ['Banking SMS', 'Phishing', 'OTP', 'Normal SMS'],
    'Accuracy': [95, 92, 94, 96]
}

# Create a DataFrame
df = pd.DataFrame(data)

# Marathi translations
marathi_labels = {
    'Chart Title': 'संदेश प्रकारांची वर्गीकरण अचूकता',
    'Y-axis label': 'अचूकता टक्केवारी',
    'X-axis label': 'संदेश प्रकार',
    'Banking SMS': 'बँकिंग एसएमएस',
    'Phishing': 'फिशिंग',
    'OTP': 'ओटीपी',
    'Normal SMS': 'सामान्य एसएमएस'
}

# Set Matplotlib to use a font that supports Marathi characters
plt.rcParams['font.family'] = 'DejaVu Sans' # A common default font, but we need to ensure it has Marathi glyphs or specify one that does.
# For better Marathi support, you might need to install and specify a font like 'Noto Sans Marathi'
# import matplotlib.font_manager as fm
# fm.fontManager.addfont('/path/to/NotoSansDevanagari-Regular.ttf') # Replace with actual path if needed
# plt.rcParams['font.family'] = 'Noto Sans Devanagari'

# Create the bar chart
plt.figure(figsize=(10, 6))
bars = plt.bar([marathi_labels[mt] for mt in df['Message Type']], df['Accuracy'], color=['skyblue', 'salmon', 'lightgreen', 'gold'])

# Add labels to each bar
for bar in bars:
    yval = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, yval, f'{yval}%', va='bottom', ha='center', fontsize=12)

# Set chart title and labels using Marathi text
plt.title(marathi_labels['Chart Title'], fontsize=16)
plt.xlabel(marathi_labels['X-axis label'], fontsize=12)
plt.ylabel(marathi_labels['Y-axis label'], fontsize=12)
plt.ylim(0, 100) # Set y-axis to be 0-100%

# Add a professional touch
plt.grid(axis='y', linestyle='--', alpha=0.7)
plt.tight_layout()

# Save the plot
plt.savefig('classification_accuracy_bar_chart_marathi.png')

print("Bar chart created successfully with Marathi text as classification_accuracy_bar_chart_marathi.png")