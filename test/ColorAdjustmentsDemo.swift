import SwiftUI

struct ColorAdjustmentsDemo: View {
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                Text("Color Adjustments")
                    .font(.largeTitle)
                    .bold()
                
                Text("Visual filter modifiers for brightness, contrast, saturation, and hue rotation")
                    .font(.subheadline)
                    .foregroundColor(.gray)
                
                Divider()
                
                // Brightness
                VStack(alignment: .leading, spacing: 12) {
                    Text("Brightness")
                        .font(.title)
                        .bold()
                    
                    Text("Adjust brightness from -1 (darker) to +1 (brighter)")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    HStack(spacing: 12) {
                        VStack {
                            Circle()
                                .fill(.blue)
                                .frame(width: 60, height: 60)
                                .brightness(-0.5)
                            Text("-0.5")
                                .font(.caption)
                            Text("Darker")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                        
                        VStack {
                            Circle()
                                .fill(.blue)
                                .frame(width: 60, height: 60)
                            Text("0.0")
                                .font(.caption)
                            Text("Normal")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                        
                        VStack {
                            Circle()
                                .fill(.blue)
                                .frame(width: 60, height: 60)
                                .brightness(0.5)
                            Text("+0.5")
                                .font(.caption)
                            Text("Brighter")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                    }
                    .padding()
                    .background(.white)
                    .cornerRadius(12)
                    
                    // Example with image placeholder
                    VStack(spacing: 8) {
                        Text("Brightness on Images")
                            .font(.subheadline)
                        
                        HStack(spacing: 12) {
                            VStack {
                                Rectangle()
                                    .fill(.orange)
                                    .frame(width: 80, height: 80)
                                    .cornerRadius(8)
                                    .brightness(-0.3)
                                Text("Dark")
                                    .font(.caption)
                            }
                            
                            VStack {
                                Rectangle()
                                    .fill(.orange)
                                    .frame(width: 80, height: 80)
                                    .cornerRadius(8)
                                Text("Normal")
                                    .font(.caption)
                            }
                            
                            VStack {
                                Rectangle()
                                    .fill(.orange)
                                    .frame(width: 80, height: 80)
                                    .cornerRadius(8)
                                    .brightness(0.3)
                                Text("Bright")
                                    .font(.caption)
                            }
                        }
                    }
                    .padding()
                    .background(.white)
                    .cornerRadius(12)
                }
                .padding()
                .background(.thinMaterial)
                .cornerRadius(16)
                
                Divider()
                
                // Contrast
                VStack(alignment: .leading, spacing: 12) {
                    Text("Contrast")
                        .font(.title)
                        .bold()
                    
                    Text("Adjust contrast (0 = gray, 1 = normal, 2+ = high contrast)")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    HStack(spacing: 12) {
                        VStack {
                            RoundedRectangle(cornerRadius: 8)
                                .fill(LinearGradient(colors: [.blue, .purple], startPoint: .leading, endPoint: .trailing))
                                .frame(width: 80, height: 80)
                                .contrast(0.5)
                            Text("0.5")
                                .font(.caption)
                            Text("Low")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                        
                        VStack {
                            RoundedRectangle(cornerRadius: 8)
                                .fill(LinearGradient(colors: [.blue, .purple], startPoint: .leading, endPoint: .trailing))
                                .frame(width: 80, height: 80)
                            Text("1.0")
                                .font(.caption)
                            Text("Normal")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                        
                        VStack {
                            RoundedRectangle(cornerRadius: 8)
                                .fill(LinearGradient(colors: [.blue, .purple], startPoint: .leading, endPoint: .trailing))
                                .frame(width: 80, height: 80)
                                .contrast(1.5)
                            Text("1.5")
                                .font(.caption)
                            Text("High")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                    }
                    .padding()
                    .background(.white)
                    .cornerRadius(12)
                }
                .padding()
                .background(.regularMaterial)
                .cornerRadius(16)
                
                Divider()
                
                // Saturation
                VStack(alignment: .leading, spacing: 12) {
                    Text("Saturation")
                        .font(.title)
                        .bold()
                    
                    Text("Adjust color saturation (0 = grayscale, 1 = normal, 2+ = vibrant)")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    HStack(spacing: 12) {
                        VStack {
                            Circle()
                                .fill(.red)
                                .frame(width: 60, height: 60)
                                .saturation(0)
                            Text("0.0")
                                .font(.caption)
                            Text("Grayscale")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                        
                        VStack {
                            Circle()
                                .fill(.red)
                                .frame(width: 60, height: 60)
                                .saturation(0.5)
                            Text("0.5")
                                .font(.caption)
                            Text("Desaturated")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                        
                        VStack {
                            Circle()
                                .fill(.red)
                                .frame(width: 60, height: 60)
                            Text("1.0")
                                .font(.caption)
                            Text("Normal")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                        
                        VStack {
                            Circle()
                                .fill(.red)
                                .frame(width: 60, height: 60)
                                .saturation(2)
                            Text("2.0")
                                .font(.caption)
                            Text("Vibrant")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                    }
                    .padding()
                    .background(.white)
                    .cornerRadius(12)
                }
                .padding()
                .background(.ultraThinMaterial)
                .cornerRadius(16)
                
                Divider()
                
                // Hue Rotation
                VStack(alignment: .leading, spacing: 12) {
                    Text("Hue Rotation")
                        .font(.title)
                        .bold()
                    
                    Text("Rotate color hue by degrees (0-360)")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    HStack(spacing: 12) {
                        VStack {
                            Circle()
                                .fill(.blue)
                                .frame(width: 60, height: 60)
                            Text("0°")
                                .font(.caption)
                            Text("Original")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                        
                        VStack {
                            Circle()
                                .fill(.blue)
                                .frame(width: 60, height: 60)
                                .hueRotation(.degrees(90))
                            Text("90°")
                                .font(.caption)
                            Text("Rotated")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                        
                        VStack {
                            Circle()
                                .fill(.blue)
                                .frame(width: 60, height: 60)
                                .hueRotation(.degrees(180))
                            Text("180°")
                                .font(.caption)
                            Text("Opposite")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                        
                        VStack {
                            Circle()
                                .fill(.blue)
                                .frame(width: 60, height: 60)
                                .hueRotation(.degrees(270))
                            Text("270°")
                                .font(.caption)
                            Text("Rotated")
                                .font(.caption2)
                                .foregroundColor(.gray)
                        }
                    }
                    .padding()
                    .background(.white)
                    .cornerRadius(12)
                }
                .padding()
                .background(.thinMaterial)
                .cornerRadius(16)
                
                Divider()
                
                // Combined Effects
                VStack(alignment: .leading, spacing: 12) {
                    Text("Combined Effects")
                        .font(.title)
                        .bold()
                    
                    Text("Multiple color adjustments can be combined")
                        .font(.subheadline)
                        .foregroundColor(.gray)
                    
                    VStack(spacing: 12) {
                        HStack {
                            Text("Original:")
                            Spacer()
                            RoundedRectangle(cornerRadius: 8)
                                .fill(.purple)
                                .frame(width: 100, height: 60)
                        }
                        
                        HStack {
                            Text("Bright + Saturated:")
                            Spacer()
                            RoundedRectangle(cornerRadius: 8)
                                .fill(.purple)
                                .brightness(0.2)
                                .saturation(1.5)
                                .frame(width: 100, height: 60)
                        }
                        
                        HStack {
                            Text("Dark + High Contrast:")
                            Spacer()
                            RoundedRectangle(cornerRadius: 8)
                                .fill(.purple)
                                .brightness(-0.2)
                                .contrast(1.3)
                                .frame(width: 100, height: 60)
                        }
                        
                        HStack {
                            Text("Hue Rotated:")
                            Spacer()
                            RoundedRectangle(cornerRadius: 8)
                                .fill(.purple)
                                .hueRotation(.degrees(120))
                                .frame(width: 100, height: 60)
                        }
                    }
                    .padding()
                    .background(.white)
                    .cornerRadius(12)
                }
                .padding()
                .background(.regularMaterial)
                .cornerRadius(16)
                
                // Tips
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Text("💡")
                            .font(.title)
                        Text("Usage Tips")
                            .font(.headline)
                    }
                    
                    Text("• Brightness: Adjust lighting without changing colors")
                    Text("• Contrast: Make colors pop or create muted effects")
                    Text("• Saturation: Control color intensity or create B&W")
                    Text("• Hue Rotation: Create color variations from single source")
                    Text("• Combine effects for creative visual styles")
                }
                .font(.subheadline)
                .foregroundColor(.gray)
                .padding()
                .background(.yellow.opacity(0.1))
                .cornerRadius(12)
            }
            .padding(24)
        }
    }
}
