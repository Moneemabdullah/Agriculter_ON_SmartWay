import { useEffect, useRef } from 'react';
import { Cpu, Thermometer, Droplets, Wifi, TrendingUp, Clock, Shield, BarChart3, Zap, Activity, Radio, Gauge } from 'lucide-react';
import { ImageWithFallback } from './Figma/ImageWithFallback';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const heroRef = useRef(null);
  const techSectionRef = useRef(null);
  const benefitsRef = useRef(null);

  useEffect(() => {
    // Hero animation
    // gsap.from(heroRef.current, {
    //   opacity: 0,
    //   y: 50,
    //   duration: 1,
    //   ease: 'power3.out'
    // });

    // Technology cards animation
    // gsap.from('.tech-card', {
    //   scrollTrigger: {
    //     trigger: techSectionRef.current,
    //     start: 'top 80%',
    //   },
    //   opacity: 0,
    //   y: 50,
    //   stagger: 0.2,
    //   duration: 0.8,
    //   ease: 'power3.out'
    // });

    // Benefits animation
    // gsap.from('.benefit-card', {
    //   scrollTrigger: {
    //     trigger: benefitsRef.current,
    //     start: 'top 80%',
    //   },
    //   opacity: 0,
    //   scale: 0.9,
    //   stagger: 0.15,
    //   duration: 0.6,
    //   ease: 'back.out(1.7)'
    // });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1708794666324-85ad91989d20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGFncmljdWx0dXJlJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjYwMDAxNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Smart Agriculture Technology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1a4d3c]/80"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
          <div className="inline-block mb-4 px-4 py-2 bg-[#7ab42c] rounded-full">
            <span className="text-sm uppercase tracking-wider">Our Technology</span>
          </div>
          <h1 className="text-5xl md:text-6xl mb-6">Smart Agriculture Monitoring System</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Revolutionizing farming with cutting-edge IoT technology, real-time monitoring, and intelligent automation
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6 text-[#1a4d3c]">What is Smart Agriculture?</h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Our Smart Agriculture Monitoring System integrates advanced sensors, microcontrollers, and cloud connectivity 
              to provide farmers with real-time insights into their crops and environmental conditions. By leveraging IoT 
              technology, we enable data-driven decision making that optimizes resource usage, increases yields, and promotes 
              sustainable farming practices.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#7ab42c] rounded-full flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-4 text-[#1a4d3c]">Real-Time Monitoring</h3>
              <p className="text-gray-600">
                Continuously track temperature, humidity, soil moisture, and other critical parameters 24/7 from anywhere.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#7ab42c] rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-4 text-[#1a4d3c]">Automated Control</h3>
              <p className="text-gray-600">
                Smart irrigation systems automatically water crops based on sensor data, saving water and improving efficiency.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#7ab42c] rounded-full flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl mb-4 text-[#1a4d3c]">Data Analytics</h3>
              <p className="text-gray-600">
                Analyze historical trends and receive actionable insights to optimize farming operations and predict issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ESP32 Section */}
      <section ref={techSectionRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="tech-card">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1634452015397-ad0686a2ae2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3AzMiUyMG1pY3JvY29udHJvbGxlcnxlbnwxfHx8fDE3NjYwMDAxNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="ESP32 Microcontroller"
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
            </div>
            
            <div className="tech-card">
              <div className="inline-flex items-center gap-2 mb-4 text-[#7ab42c]">
                <Cpu className="w-6 h-6" />
                <span className="uppercase tracking-wider">Core Technology</span>
              </div>
              <h2 className="text-4xl mb-6 text-[#1a4d3c]">ESP32 Microcontroller</h2>
              <p className="text-gray-700 mb-6 text-lg">
                The ESP32 is the brain of our smart agriculture system. This powerful, energy-efficient microcontroller 
                features built-in Wi-Fi and Bluetooth connectivity, making it perfect for IoT applications.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#7ab42c]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Wifi className="w-6 h-6 text-[#7ab42c]" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-[#1a4d3c]">Wireless Connectivity</h4>
                    <p className="text-gray-600">
                      Built-in Wi-Fi enables seamless data transmission to the cloud and mobile devices in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#7ab42c]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-[#7ab42c]" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-[#1a4d3c]">Low Power Consumption</h4>
                    <p className="text-gray-600">
                      Advanced power management allows the system to run for months on battery power in remote locations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#7ab42c]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Radio className="w-6 h-6 text-[#7ab42c]" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-[#1a4d3c]">Multiple I/O Pins</h4>
                    <p className="text-gray-600">
                      Connect various sensors and actuators simultaneously for comprehensive environmental monitoring.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DHT Sensor Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="tech-card order-2 md:order-1">
              <div className="inline-flex items-center gap-2 mb-4 text-[#7ab42c]">
                <Thermometer className="w-6 h-6" />
                <span className="uppercase tracking-wider">Temperature & Humidity</span>
              </div>
              <h2 className="text-4xl mb-6 text-[#1a4d3c]">DHT Sensors (DHT11/DHT22)</h2>
              <p className="text-gray-700 mb-6 text-lg">
                DHT sensors are essential for monitoring environmental conditions. These reliable, low-cost sensors 
                measure both temperature and humidity with high accuracy, providing crucial data for crop management.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#7ab42c]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Thermometer className="w-6 h-6 text-[#7ab42c]" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-[#1a4d3c]">Precise Temperature Readings</h4>
                    <p className="text-gray-600">
                      Monitor ambient temperature from -40°C to 80°C with ±0.5°C accuracy (DHT22) to ensure optimal growing conditions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#7ab42c]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-6 h-6 text-[#7ab42c]" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-[#1a4d3c]">Humidity Monitoring</h4>
                    <p className="text-gray-600">
                      Track relative humidity levels from 0-100% to prevent fungal diseases and optimize plant transpiration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#7ab42c]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#7ab42c]" />
                  </div>
                  <div>
                    <h4 className="mb-2 text-[#1a4d3c]">Fast Response Time</h4>
                    <p className="text-gray-600">
                      Quick sampling intervals allow for rapid detection of environmental changes and immediate alerts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="tech-card order-1 md:order-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1708794666324-85ad91989d20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMHNlbnNvcnN8ZW58MXx8fHwxNzY2MDAwMTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Agriculture Sensors"
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Other Sensors Section */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="tech-card">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761839257144-297ce252742e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmYXJtaW5nJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjU5NjMyMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern Farming Technology"
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
            </div>
            
            <div className="tech-card">
              <div className="inline-flex items-center gap-2 mb-4 text-[#7ab42c]">
                <Gauge className="w-6 h-6" />
                <span className="uppercase tracking-wider">Advanced Sensing</span>
              </div>
              <h2 className="text-4xl mb-6 text-[#1a4d3c]">Additional Sensors</h2>
              <p className="text-gray-700 mb-6 text-lg">
                Our system integrates multiple specialized sensors to provide comprehensive monitoring of all critical 
                parameters affecting crop health and productivity.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="mb-2 text-[#1a4d3c]">Soil Moisture Sensors</h4>
                  <p className="text-gray-600">
                    Measure volumetric water content in soil to determine irrigation needs and prevent over/under-watering.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="mb-2 text-[#1a4d3c]">Light Intensity Sensors</h4>
                  <p className="text-gray-600">
                    Monitor sunlight exposure to optimize greenhouse conditions and track day length for photoperiod-sensitive crops.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="mb-2 text-[#1a4d3c]">pH & NPK Sensors</h4>
                  <p className="text-gray-600">
                    Analyze soil chemistry to ensure proper nutrient levels and pH balance for optimal plant growth.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="mb-2 text-[#1a4d3c]">Rain Detection Sensors</h4>
                  <p className="text-gray-600">
                    Automatically pause irrigation during rainfall to conserve water and reduce operational costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Irrigation System Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 text-[#7ab42c]">
              <Droplets className="w-6 h-6" />
              <span className="uppercase tracking-wider">Smart Irrigation</span>
            </div>
            <h2 className="text-4xl md:text-5xl mb-6 text-[#1a4d3c]">Intelligent Irrigation System</h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Our automated irrigation system uses real-time sensor data to deliver the right amount of water at the right time, 
              reducing water waste by up to 50% while improving crop yields.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1685475188388-2a266e6bd5c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGlycmlnYXRpb24lMjBzeXN0ZW18ZW58MXx8fHwxNzY2MDAwMTY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Smart Irrigation System"
                className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              />
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl mb-3 text-[#1a4d3c]">Automated Scheduling</h4>
                <p className="text-gray-600">
                  Based on soil moisture levels, weather forecasts, and crop requirements, the system automatically determines 
                  when and how much to water.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl mb-3 text-[#1a4d3c]">Zone-Based Control</h4>
                <p className="text-gray-600">
                  Manage different irrigation zones independently based on specific crop needs, soil types, and topography.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl mb-3 text-[#1a4d3c]">Remote Operation</h4>
                <p className="text-gray-600">
                  Control irrigation systems from anywhere using mobile apps or web dashboards, with manual override options.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl mb-3 text-[#1a4d3c]">Water Conservation</h4>
                <p className="text-gray-600">
                  Precision irrigation reduces water consumption, lowers energy costs, and minimizes nutrient leaching.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Benefits Section */}
      <section ref={benefitsRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6 text-[#1a4d3c]">How Farmers Benefit</h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Our Smart Agriculture Monitoring System empowers farmers with technology that saves time, 
              reduces costs, and increases productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="benefit-card bg-gradient-to-br from-[#1a4d3c] to-[#2a6d5c] p-8 rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow">
              <TrendingUp className="w-12 h-12 mb-4" />
              <h3 className="text-2xl mb-4">Increased Yields</h3>
              <p className="opacity-90">
                Optimize growing conditions and respond quickly to issues, resulting in 15-30% higher crop yields.
              </p>
            </div>

            <div className="benefit-card bg-gradient-to-br from-[#7ab42c] to-[#6aa42c] p-8 rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow">
              <Droplets className="w-12 h-12 mb-4" />
              <h3 className="text-2xl mb-4">Water Savings</h3>
              <p className="opacity-90">
                Reduce water usage by 30-50% through precise, data-driven irrigation scheduling and automation.
              </p>
            </div>

            <div className="benefit-card bg-gradient-to-br from-[#1a4d3c] to-[#2a6d5c] p-8 rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow">
              <Clock className="w-12 h-12 mb-4" />
              <h3 className="text-2xl mb-4">Time Efficiency</h3>
              <p className="opacity-90">
                Automate routine tasks and monitoring, freeing up valuable time for strategic farm management decisions.
              </p>
            </div>

            <div className="benefit-card bg-gradient-to-br from-[#7ab42c] to-[#6aa42c] p-8 rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow">
              <Shield className="w-12 h-12 mb-4" />
              <h3 className="text-2xl mb-4">Risk Reduction</h3>
              <p className="opacity-90">
                Early detection of problems like drought stress, pest infestations, or disease outbreaks minimizes crop loss.
              </p>
            </div>

            <div className="benefit-card bg-gradient-to-br from-[#1a4d3c] to-[#2a6d5c] p-8 rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow">
              <BarChart3 className="w-12 h-12 mb-4" />
              <h3 className="text-2xl mb-4">Data-Driven Decisions</h3>
              <p className="opacity-90">
                Make informed choices based on real data and historical trends rather than guesswork or intuition.
              </p>
            </div>

            <div className="benefit-card bg-gradient-to-br from-[#7ab42c] to-[#6aa42c] p-8 rounded-lg text-white shadow-lg hover:shadow-xl transition-shadow">
              <Zap className="w-12 h-12 mb-4" />
              <h3 className="text-2xl mb-4">Lower Costs</h3>
              <p className="opacity-90">
                Reduce expenses on water, fertilizers, pesticides, and labor through precise resource management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl mb-6 text-[#1a4d3c]">How It Works</h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Our system follows a simple yet powerful workflow that transforms raw sensor data into actionable farming insights.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#7ab42c] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                1
              </div>
              <h3 className="text-xl mb-3 text-[#1a4d3c]">Data Collection</h3>
              <p className="text-gray-600">
                Sensors continuously monitor environmental parameters like temperature, humidity, and soil moisture.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#7ab42c] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                2
              </div>
              <h3 className="text-xl mb-3 text-[#1a4d3c]">Data Transmission</h3>
              <p className="text-gray-600">
                ESP32 microcontroller processes sensor data and transmits it wirelessly to the cloud via Wi-Fi.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#7ab42c] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                3
              </div>
              <h3 className="text-xl mb-3 text-[#1a4d3c]">Analysis & Alerts</h3>
              <p className="text-gray-600">
                Cloud platform analyzes data, identifies patterns, and sends alerts when conditions require attention.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#7ab42c] rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl">
                4
              </div>
              <h3 className="text-xl mb-3 text-[#1a4d3c]">Automated Action</h3>
              <p className="text-gray-600">
                System automatically triggers irrigation or sends notifications to farmers for manual intervention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#1a4d3c] to-[#7ab42c] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl mb-6">Ready to Transform Your Farm?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers who are already using smart agriculture technology to grow more with less.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-white text-[#1a4d3c] px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
              Get Started Today
            </button>
            <button className="border-2 border-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors">
              Contact Our Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
