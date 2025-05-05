import SymptomAnalyzer from './ml-model.js';

document.addEventListener('DOMContentLoaded', async () => { 
    // why async coz let everyhting load first(html and css)
    const analyzeBtn = document.getElementById('analyze-btn');
    const symptomsInput = document.getElementById('symptoms');
    const durationSelect = document.getElementById('duration');
    const loadingDiv = document.getElementById('loading');
    const resultsContent = document.getElementById('results-content');
    const conditionsList = document.getElementById('conditions-list');
    const recommendationsList = document.getElementById('recommendations-list');
    const severityBar = document.getElementById('severity-bar');
    const severityText = document.getElementById('severity-text');

    let symptomAnalyzer = null;
    let mlModelAvailable = false;

    try {
        // Initialize ML model
        symptomAnalyzer = new SymptomAnalyzer(); 
        await symptomAnalyzer.initialize();

        // Enhanced training data with more comprehensive examples
        const trainingData = {
            symptoms: [
                // Respiratory conditions
                ['fever', 'cough', 'fatigue', 'sore throat', 'runny nose'],
                ['cough', 'shortness of breath', 'chest pain', 'fatigue'],
                ['fever', 'cough', 'body aches', 'fatigue', 'headache'],
                ['sore throat', 'fever', 'swollen lymph nodes', 'fatigue'],
                ['cough', 'wheezing', 'shortness of breath', 'chest tightness'],
                
                // Neurological conditions
                ['headache', 'nausea', 'dizziness', 'sensitivity to light'],
                ['headache', 'fever', 'stiff neck', 'confusion'],
                ['dizziness', 'balance problems', 'nausea', 'vomiting'],
                ['headache', 'vision problems', 'nausea', 'vomiting'],
                ['memory problems', 'confusion', 'personality changes', 'difficulty speaking'],
                
                // Mental health conditions
                ['stress', 'anxiety', 'insomnia', 'fatigue'],
                ['depression', 'fatigue', 'sleep problems', 'loss of interest'],
                ['anxiety', 'panic attacks', 'shortness of breath', 'chest pain'],
                ['stress', 'headache', 'muscle tension', 'sleep problems'],
                ['depression', 'anxiety', 'fatigue', 'appetite changes'],
                
                // Digestive conditions
                ['stomach pain', 'diarrhea', 'nausea', 'vomiting'],
                ['abdominal pain', 'bloating', 'constipation', 'gas'],
                ['stomach pain', 'heartburn', 'acid reflux', 'chest pain'],
                ['diarrhea', 'fever', 'abdominal pain', 'dehydration'],
                ['nausea', 'vomiting', 'dizziness', 'fatigue'],
                
                // Musculoskeletal conditions
                ['joint pain', 'fatigue', 'morning stiffness', 'swelling'],
                ['back pain', 'muscle pain', 'limited mobility', 'fatigue'],
                ['joint pain', 'swelling', 'redness', 'warmth'],
                ['muscle pain', 'fatigue', 'weakness', 'tenderness'],
                ['back pain', 'leg pain', 'numbness', 'tingling'],
                
                // Skin conditions
                ['rash', 'itching', 'redness', 'swelling'],
                ['skin rash', 'fever', 'joint pain', 'fatigue'],
                ['itching', 'dry skin', 'redness', 'scaling'],
                ['skin rash', 'blisters', 'pain', 'itching'],
                ['skin rash', 'fever', 'sore throat', 'fatigue'],
                
                // Endocrine conditions
                ['fatigue', 'weight gain', 'cold intolerance', 'dry skin'],
                ['fatigue', 'weight loss', 'heat intolerance', 'sweating'],
                ['thirst', 'frequent urination', 'fatigue', 'blurred vision'],
                ['fatigue', 'muscle weakness', 'weight loss', 'increased appetite'],
                ['fatigue', 'weight gain', 'mood changes', 'sleep problems'],
                
                // Cardiovascular conditions
                ['chest pain', 'shortness of breath', 'fatigue', 'sweating'],
                ['chest pain', 'arm pain', 'shortness of breath', 'nausea'],
                ['shortness of breath', 'fatigue', 'swelling', 'chest pain'],
                ['irregular heartbeat', 'chest pain', 'dizziness', 'fatigue'],
                ['high blood pressure', 'headache', 'dizziness', 'chest pain'],
                
                // Additional conditions
                ['fever', 'fatigue', 'muscle pain', 'headache'],
                ['fatigue', 'sleep problems', 'mood changes', 'appetite changes'],
                ['headache', 'fever', 'muscle pain', 'fatigue'],
                ['dizziness', 'balance problems', 'hearing problems', 'tinnitus'],
                ['vision problems', 'headache', 'nausea', 'vomiting']
            ],
            conditions: [
                // Respiratory conditions
                'Common Cold',
                'Bronchitis',
                'Pneumonia',
                'Strep Throat',
                'Asthma',
                
                // Neurological conditions
                'Migraine',
                'Meningitis',
                'Vertigo',
                'Brain Tumor',
                'Alzheimer\'s Disease',
                
                // Mental health conditions
                'Anxiety Disorder',
                'Major Depressive Disorder',
                'Panic Disorder',
                'Stress Disorder',
                'Bipolar Disorder',
                
                // Digestive conditions
                'Gastritis',
                'Irritable Bowel Syndrome',
                'Gastroesophageal Reflux Disease',
                'Food Poisoning',
                'Appendicitis',
                
                // Musculoskeletal conditions
                'Rheumatoid Arthritis',
                'Osteoarthritis',
                'Fibromyalgia',
                'Gout',
                'Sciatica',
                
                // Skin conditions
                'Eczema',
                'Psoriasis',
                'Contact Dermatitis',
                'Shingles',
                'Lupus',
                
                // Endocrine conditions
                'Hypothyroidism',
                'Hyperthyroidism',
                'Diabetes',
                'Addison\'s Disease',
                'Cushing\'s Syndrome',
                
                // Cardiovascular conditions
                'Angina',
                'Heart Attack',
                'Heart Failure',
                'Arrhythmia',
                'Hypertension',
                
                // Additional conditions
                'Viral Infection',
                'Chronic Fatigue Syndrome',
                'Influenza',
                'Meniere\'s Disease',
                'Glaucoma'
            ]
        };

        // Train the model with sample data
        await symptomAnalyzer.trainModel(trainingData);
        mlModelAvailable = true;
        console.log('ML Model trained successfully');
    } catch (error) {
        console.error('Error initializing ML model:', error);
        mlModelAvailable = false;
        console.log('Falling back to rule-based analysis');   
    }

    // agar ml failed ho gya then prefer to this rule based conditions 
    // Enhanced symptom to condition mapping with more detailed symptoms
    const SYMPTOM_CONDITIONS = {
        // Physical symptoms
        'fever': ['Common Cold', 'Flu', 'Viral Infection', 'Bacterial Infection', 'Malaria', 'Typhoid', 'Dengue'],
        'headache': ['Migraine', 'Tension Headache', 'Sinusitis', 'Dehydration', 'Stress', 'High Blood Pressure', 'Brain Tumor', 'Meningitis'],
        'cough': ['Common Cold', 'Bronchitis', 'Allergies', 'Asthma', 'Post-nasal Drip', 'Pneumonia', 'Tuberculosis', 'Lung Cancer'],
        'fatigue': ['Anemia', 'Depression', 'Chronic Fatigue Syndrome', 'Sleep Disorders', 'Thyroid Issues', 'Diabetes', 'Heart Disease', 'Cancer'],
        'nausea': ['Food Poisoning', 'Gastritis', 'Morning Sickness', 'Motion Sickness', 'Anxiety', 'Appendicitis', 'Gallbladder Disease', 'Pancreatitis'],
        'dizziness': ['Vertigo', 'Low Blood Pressure', 'Anemia', 'Inner Ear Problems', 'Dehydration', 'Heart Problems', 'Stroke', 'Multiple Sclerosis'],
        'chest pain': ['Angina', 'Anxiety', 'Heart Attack', 'Costochondritis', 'Acid Reflux', 'Pneumonia', 'Pulmonary Embolism', 'Aortic Dissection'],
        'shortness of breath': ['Asthma', 'Anxiety', 'Allergies', 'Heart Problems', 'Lung Issues', 'Pulmonary Embolism', 'Pneumonia', 'Heart Failure'],
        'muscle pain': ['Flu', 'Fibromyalgia', 'Exercise Injury', 'Stress', 'Vitamin D Deficiency', 'Lupus', 'Rheumatoid Arthritis', 'Polymyalgia Rheumatica'],
        'sore throat': ['Common Cold', 'Strep Throat', 'Tonsillitis', 'Allergies', 'Acid Reflux', 'Mononucleosis', 'HIV', 'Throat Cancer'],
        
        // Mental health symptoms
        'stress': ['Anxiety', 'Depression', 'Burnout', 'Sleep Disorders', 'High Blood Pressure', 'Heart Disease', 'Digestive Issues', 'Immune System Problems'],
        'anxiety': ['Generalized Anxiety Disorder', 'Panic Disorder', 'Stress', 'Depression', 'PTSD', 'OCD', 'Social Anxiety', 'Phobias'],
        'depression': ['Major Depressive Disorder', 'Seasonal Affective Disorder', 'Bipolar Disorder', 'Dysthymia', 'Postpartum Depression', 'Psychotic Depression'],
        'insomnia': ['Sleep Disorders', 'Anxiety', 'Depression', 'Stress', 'Circadian Rhythm Disorders', 'Sleep Apnea', 'Restless Leg Syndrome', 'Narcolepsy'],
        
        // Digestive symptoms
        'stomach pain': ['Gastritis', 'Food Poisoning', 'Irritable Bowel Syndrome', 'Ulcer', 'Acid Reflux', 'Appendicitis', 'Gallbladder Disease', 'Pancreatitis'],
        'diarrhea': ['Food Poisoning', 'Viral Infection', 'Irritable Bowel Syndrome', 'Food Intolerance', 'Celiac Disease', 'Crohn\'s Disease', 'Ulcerative Colitis'],
        'constipation': ['Dehydration', 'Dietary Issues', 'Irritable Bowel Syndrome', 'Thyroid Problems', 'Colon Cancer', 'Hernia', 'Bowel Obstruction'],
        
        // Skin symptoms
        'rash': ['Allergic Reaction', 'Eczema', 'Contact Dermatitis', 'Viral Infection', 'Fungal Infection', 'Psoriasis', 'Lupus', 'Lyme Disease'],
        'itching': ['Allergies', 'Eczema', 'Dry Skin', 'Fungal Infection', 'Parasitic Infection', 'Liver Disease', 'Kidney Disease', 'Thyroid Problems'],
        
        // Additional symptoms
        'joint pain': ['Arthritis', 'Rheumatoid Arthritis', 'Osteoarthritis', 'Gout', 'Lupus', 'Fibromyalgia', 'Lyme Disease'],
        'back pain': ['Muscle Strain', 'Herniated Disc', 'Sciatica', 'Osteoporosis', 'Kidney Problems', 'Spinal Stenosis', 'Ankylosing Spondylitis'],
        'eye problems': ['Conjunctivitis', 'Glaucoma', 'Cataracts', 'Macular Degeneration', 'Dry Eye Syndrome', 'Retinal Detachment'],
        'ear problems': ['Ear Infection', 'Tinnitus', 'Meniere\'s Disease', 'Earwax Buildup', 'Otosclerosis', 'Acoustic Neuroma'],
        'weight loss': ['Hyperthyroidism', 'Diabetes', 'Cancer', 'Depression', 'Eating Disorders', 'Celiac Disease', 'Tuberculosis'],
        'weight gain': ['Hypothyroidism', 'Diabetes', 'Cushing\'s Syndrome', 'Polycystic Ovary Syndrome', 'Depression', 'Medication Side Effects'],
        'memory problems': ['Alzheimer\'s Disease', 'Dementia', 'Depression', 'Vitamin B12 Deficiency', 'Thyroid Problems', 'Brain Tumor'],
        'tremors': ['Essential Tremor', 'Parkinson\'s Disease', 'Multiple Sclerosis', 'Hyperthyroidism', 'Alcohol Withdrawal', 'Medication Side Effects']
    };

    // Enhanced recommendations with more detailed and personalized advice
    const RECOMMENDATIONS = {
        'Common Cold': [
            { text: 'Rest and get adequate sleep', priority: 'high', type: 'lifestyle' },
            { text: 'Stay hydrated with warm fluids', priority: 'high', type: 'lifestyle' },
            { text: 'Use over-the-counter cold medicine', priority: 'medium', type: 'medication' },
            { text: 'Try steam inhalation', priority: 'medium', type: 'home_remedy' },
            { text: 'Consider vitamin C supplements', priority: 'low', type: 'supplement' },
            { text: 'Use saline nasal drops', priority: 'medium', type: 'medication' },
            { text: 'Gargle with warm salt water', priority: 'low', type: 'home_remedy' },
            { text: 'Avoid smoking and secondhand smoke', priority: 'high', type: 'lifestyle' }
        ],
        'Flu': [
            { text: 'Rest and get plenty of sleep', priority: 'high', type: 'lifestyle' },
            { text: 'Stay hydrated with water and electrolyte drinks', priority: 'high', type: 'lifestyle' },
            { text: 'Take antiviral medication if prescribed', priority: 'high', type: 'medication' },
            { text: 'Use over-the-counter pain relievers', priority: 'medium', type: 'medication' },
            { text: 'Consider getting a flu shot next season', priority: 'medium', type: 'prevention' },
            { text: 'Use a humidifier', priority: 'low', type: 'home_remedy' },
            { text: 'Take warm baths', priority: 'low', type: 'home_remedy' },
            { text: 'Avoid contact with others to prevent spread', priority: 'high', type: 'prevention' }
        ],
        'Viral Infection': [
            'Rest and get adequate sleep',
            'Stay hydrated',
            'Take over-the-counter pain relievers',
            'Monitor temperature',
            'Seek medical attention if symptoms worsen',
            'Use a humidifier',
            'Take warm baths',
            'Avoid contact with others'
        ],
        'Migraine': [
            'Rest in a dark, quiet room',
            'Take prescribed migraine medication',
            'Apply cold or warm compress',
            'Stay hydrated',
            'Identify and avoid triggers',
            'Practice stress management',
            'Maintain regular sleep schedule',
            'Consider preventive medication'
        ],
        'Tension Headache': [
            'Take over-the-counter pain relievers',
            'Practice stress management techniques',
            'Get adequate sleep',
            'Try gentle neck stretches',
            'Consider massage therapy',
            'Apply heat or cold packs',
            'Practice relaxation techniques',
            'Maintain good posture'
        ],
        'Anxiety': [
            'Practice deep breathing exercises',
            'Try meditation or mindfulness',
            'Consider therapy or counseling',
            'Regular exercise',
            'Limit caffeine and alcohol',
            'Maintain a regular sleep schedule',
            'Practice progressive muscle relaxation',
            'Consider medication if prescribed'
        ],
        'Depression': [
            'Seek professional help',
            'Practice self-care routines',
            'Consider therapy or counseling',
            'Regular exercise',
            'Maintain a healthy sleep schedule',
            'Consider medication if prescribed',
            'Practice mindfulness and meditation'
        ],
        'Stress': [
            'Practice stress management techniques',
            'Regular exercise',
            'Get adequate sleep',
            'Consider meditation or yoga',
            'Take regular breaks from work',
            'Maintain a healthy diet',
            'Practice time management',
            'Consider professional help if needed'
        ],
        'Sleep Disorders': [
            'Maintain a regular sleep schedule',
            'Create a relaxing bedtime routine',
            'Limit screen time before bed',
            'Keep bedroom cool and dark',
            'Consider consulting a sleep specialist',
            'Avoid caffeine and alcohol',
            'Exercise regularly but not before bed',
            'Consider cognitive behavioral therapy'
        ],
        'High Blood Pressure': [
            'Reduce salt intake',
            'Exercise regularly',
            'Maintain a healthy weight',
            'Limit alcohol consumption',
            'Quit smoking',
            'Take prescribed medication',
            'Monitor blood pressure regularly',
            'Practice stress management'
        ],
        'Diabetes': [
            'Monitor blood sugar levels',
            'Follow a balanced diet',
            'Exercise regularly',
            'Take prescribed medication',
            'Maintain a healthy weight',
            'Regular check-ups with doctor',
            'Monitor for complications',
            'Stay hydrated'
        ],
        'Heart Disease': [
            'Follow a heart-healthy diet',
            'Exercise regularly',
            'Quit smoking',
            'Limit alcohol consumption',
            'Take prescribed medication',
            'Monitor blood pressure',
            'Manage stress',
            'Regular check-ups with cardiologist'
        ],
        'Asthma': [
            'Use prescribed inhalers',
            'Avoid triggers',
            'Monitor peak flow',
            'Create an asthma action plan',
            'Regular check-ups with doctor',
            'Consider allergy testing',
            'Maintain clean living environment',
            'Exercise with caution'
        ],
        'Arthritis': [
            'Exercise regularly',
            'Maintain a healthy weight',
            'Use heat and cold therapy',
            'Take prescribed medication',
            'Consider physical therapy',
            'Use assistive devices if needed',
            'Practice joint protection',
            'Consider dietary changes'
        ],
        'Thyroid Issues': [
            'Take prescribed medication',
            'Regular blood tests',
            'Maintain a balanced diet',
            'Exercise regularly',
            'Monitor symptoms',
            'Regular check-ups with endocrinologist',
            'Consider dietary supplements',
            'Manage stress levels'
        ]
    };

    // Add diet recommendations database
    const DIET_RECOMMENDATIONS = {
        'Common Cold': {
            foods: [
                { name: 'Citrus fruits', reason: 'High in vitamin C to boost immunity' },
                { name: 'Ginger tea', reason: 'Anti-inflammatory and helps with congestion' },
                { name: 'Chicken soup', reason: 'Hydrating and contains anti-inflammatory properties' },
                { name: 'Honey', reason: 'Natural cough suppressant and immune booster' },
                { name: 'Garlic', reason: 'Antimicrobial properties' }
            ],
            avoid: [
                'Dairy products',
                'Sugary foods',
                'Processed foods',
                'Alcohol',
                'Caffeine'
            ]
        },
        'Flu': {
            foods: [
                { name: 'Broth-based soups', reason: 'Hydrating and easy to digest' },
                { name: 'Bananas', reason: 'Easy to digest and provide energy' },
                { name: 'Oatmeal', reason: 'Gentle on stomach and provides energy' },
                { name: 'Yogurt', reason: 'Contains probiotics for gut health' },
                { name: 'Green leafy vegetables', reason: 'Rich in vitamins and minerals' }
            ],
            avoid: [
                'Fried foods',
                'Spicy foods',
                'Alcohol',
                'Caffeine',
                'Sugary drinks'
            ]
        },
        'Anxiety': {
            foods: [
                { name: 'Fatty fish', reason: 'Rich in omega-3 fatty acids' },
                { name: 'Dark chocolate', reason: 'Contains mood-boosting compounds' },
                { name: 'Chamomile tea', reason: 'Natural calming properties' },
                { name: 'Greek yogurt', reason: 'Contains probiotics for gut-brain health' },
                { name: 'Green tea', reason: 'Contains L-theanine for relaxation' }
            ],
            avoid: [
                'Caffeine',
                'Alcohol',
                'Sugary foods',
                'Processed foods',
                'High-sodium foods'
            ]
        },
        'Depression': {
            foods: [
                { name: 'Salmon', reason: 'Rich in omega-3 fatty acids' },
                { name: 'Leafy greens', reason: 'High in folate and magnesium' },
                { name: 'Berries', reason: 'Rich in antioxidants' },
                { name: 'Nuts and seeds', reason: 'Good source of healthy fats and minerals' },
                { name: 'Whole grains', reason: 'Stabilize blood sugar and mood' }
            ],
            avoid: [
                'Processed foods',
                'Sugary foods',
                'Alcohol',
                'Caffeine',
                'Fried foods'
            ]
        },
        'High Blood Pressure': {
            foods: [
                { name: 'Leafy greens', reason: 'Rich in potassium' },
                { name: 'Berries', reason: 'High in antioxidants' },
                { name: 'Oatmeal', reason: 'High in fiber and low in sodium' },
                { name: 'Bananas', reason: 'Good source of potassium' },
                { name: 'Fatty fish', reason: 'Rich in omega-3 fatty acids' }
            ],
            avoid: [
                'Processed foods',
                'High-sodium foods',
                'Alcohol',
                'Caffeine',
                'Red meat'
            ]
        },
        'Diabetes': {
            foods: [
                { name: 'Non-starchy vegetables', reason: 'Low in carbohydrates' },
                { name: 'Whole grains', reason: 'High in fiber and slow-digesting carbs' },
                { name: 'Lean proteins', reason: 'Help maintain blood sugar levels' },
                { name: 'Healthy fats', reason: 'Help with insulin sensitivity' },
                { name: 'Berries', reason: 'Low glycemic index fruits' }
            ],
            avoid: [
                'Sugary foods',
                'Processed carbohydrates',
                'Fruit juices',
                'Alcohol',
                'High-fat dairy products'
            ]
        },
        'Heart Disease': {
            foods: [
                { name: 'Fatty fish', reason: 'Rich in omega-3 fatty acids' },
                { name: 'Whole grains', reason: 'High in fiber' },
                { name: 'Leafy greens', reason: 'Rich in vitamins and minerals' },
                { name: 'Berries', reason: 'High in antioxidants' },
                { name: 'Nuts and seeds', reason: 'Good source of healthy fats' }
            ],
            avoid: [
                'Processed foods',
                'Red meat',
                'High-sodium foods',
                'Alcohol',
                'Sugary foods'
            ]
        },
        'Asthma': {
            foods: [
                { name: 'Apples', reason: 'Contain quercetin, an anti-inflammatory compound' },
                { name: 'Carrots', reason: 'Rich in beta-carotene' },
                { name: 'Spinach', reason: 'High in magnesium' },
                { name: 'Salmon', reason: 'Rich in omega-3 fatty acids' },
                { name: 'Ginger', reason: 'Natural anti-inflammatory' }
            ],
            avoid: [
                'Dairy products',
                'Processed foods',
                'Sulfites',
                'Alcohol',
                'Caffeine'
            ]
        },
        'Arthritis': {
            foods: [
                { name: 'Fatty fish', reason: 'Rich in omega-3 fatty acids' },
                { name: 'Turmeric', reason: 'Natural anti-inflammatory' },
                { name: 'Ginger', reason: 'Anti-inflammatory properties' },
                { name: 'Leafy greens', reason: 'Rich in vitamins and minerals' },
                { name: 'Berries', reason: 'High in antioxidants' }
            ],
            avoid: [
                'Processed foods',
                'Red meat',
                'Fried foods',
                'Alcohol',
                'Sugary foods'
            ]
        },
        'Thyroid Issues': {
            foods: [
                { name: 'Brazil nuts', reason: 'Rich in selenium' },
                { name: 'Fish', reason: 'Good source of iodine' },
                { name: 'Dairy products', reason: 'Rich in calcium and vitamin D' },
                { name: 'Eggs', reason: 'Good source of iodine and selenium' },
                { name: 'Berries', reason: 'High in antioxidants' }
            ],
            avoid: [
                'Processed foods',
                'Soy products',
                'Cruciferous vegetables',
                'Alcohol',
                'Caffeine'
            ]
        }
    };

    // Function to extract symptoms from natural language input
    function extractSymptoms(text) {  
        try {  
            const symptoms = new Set();
            const words = text.toLowerCase().split(/\s+/); 
            
            // Enhanced symptom mapping with more natural language variations
            const symptomPatterns = {
                // Physical symptoms
                'pain': ['muscle pain', 'joint pain', 'back pain', 'stomach pain', 'chest pain', 'headache', 'lower back pain', 'pelvic pain'],
                'ache': ['headache', 'stomach ache', 'backache', 'joint ache'],
                'hurt': ['muscle pain', 'joint pain', 'back pain', 'stomach pain', 'chest pain', 'headache'],
                'sore': ['muscle pain', 'joint pain', 'back pain', 'stomach pain', 'chest pain', 'headache'],
                'tired': ['fatigue'],
                'exhausted': ['fatigue'],
                'weak': ['fatigue'],
                'fever': ['fever'],
                'hot': ['fever'],
                'cold': ['chills'],
                'cough': ['cough'],
                'sneeze': ['cough'],
                'runny nose': ['cough'],
                'stuffy nose': ['cough'],
                'wheezing': ['wheezing'],
                'whistling sound': ['wheezing'],
                'breathing difficulty': ['shortness of breath', 'wheezing'],
                'tight chest': ['chest tightness', 'shortness of breath'],
                'chest tightness': ['chest tightness', 'shortness of breath'],
                'nausea': ['nausea'],
                'vomit': ['nausea'],
                'dizzy': ['dizziness'],
                'lightheaded': ['dizziness'],
                'short of breath': ['shortness of breath'],
                'can\'t breathe': ['shortness of breath'],
                'difficulty breathing': ['shortness of breath'],
                
                // Female-specific symptoms
                'cramp': ['cramps'],
                'cramping': ['cramps'],
                'menstrual cramp': ['cramps'],
                'period cramp': ['cramps'],
                'bloat': ['bloating'],
                'bloated': ['bloating'],
                'swollen': ['bloating'],
                'breast': ['breast tenderness'],
                'breast pain': ['breast tenderness'],
                'tender breast': ['breast tenderness'],
                'tired': ['fatigue'],
                'exhausted': ['fatigue'],
                'bleeding': ['heavy bleeding'],
                'heavy period': ['heavy bleeding'],
                'mood': ['mood swings'],
                'emotional': ['mood swings'],
                'headache': ['headaches'],
                'head pain': ['headaches'],
                'nauseous': ['nausea'],
                'sick': ['nausea'],
                'pimple': ['acne'],
                'breakout': ['acne'],
                'sleep': ['sleep disturbances'],
                'insomnia': ['sleep disturbances'],
                'can\'t sleep': ['sleep disturbances'],
                'pelvic': ['pelvic pain'],
                'appetite': ['appetite changes'],
                'hungry': ['appetite changes'],
                'dizzy': ['dizziness'],
                'vertigo': ['dizziness'],
                'back pain': ['lower back pain'],
                'lower back': ['lower back pain'],
                'lumbar pain': ['lower back pain']
            };

            // Check for exact matches first
            for (const [symptom, conditions] of Object.entries(SYMPTOM_CONDITIONS)) {
                if (text.toLowerCase().includes(symptom)) {
                    symptoms.add(symptom);
                }
            }
            
            // Check for pattern matches
            for (const [pattern, symptomList] of Object.entries(symptomPatterns)) {
                if (text.toLowerCase().includes(pattern)) {
                    symptomList.forEach(symptom => symptoms.add(symptom));
                }
            }

            // Check for body part mentions with pain
            const bodyParts = ['head', 'neck', 'shoulder', 'arm', 'hand', 'chest', 'back', 'stomach', 'leg', 'foot', 'eye', 'ear', 'nose', 'throat', 'pelvic', 'breast'];
            for (const part of bodyParts) {
                if (text.toLowerCase().includes(part) && 
                    (text.toLowerCase().includes('pain') || 
                     text.toLowerCase().includes('ache') || 
                     text.toLowerCase().includes('hurt') || 
                     text.toLowerCase().includes('sore'))) {
                    symptoms.add(`${part} pain`);
                }
            }
            
            return Array.from(symptoms);
        } catch (error) {
            console.error('Error extracting symptoms:', error);
            throw error;
        }
    }       

    function analyzeSymptomsRuleBased(symptoms, duration, habits) {
        const possibleConditions = new Set();
        const recommendations = new Set();
        const conditionScores = new Map(); // Track relevance scores for conditions
        const symptomWeights = new Map(); // Track symptom weights
        
        // Define symptom weights based on severity and specificity
        const SEVERE_SYMPTOMS = new Set([
            'chest pain', 'shortness of breath', 'severe headache', 'seizures',
            'fainting', 'severe bleeding', 'sudden vision changes', 'sudden speech problems',
            'sudden weakness', 'sudden confusion'
        ]);
        
        const SPECIFIC_SYMPTOMS = new Set([
            'chest pain', 'shortness of breath', 'seizures', 'fainting',
            'sudden vision changes', 'sudden speech problems', 'sudden weakness',
            'sudden confusion', 'severe headache', 'severe bleeding'
        ]);
        
        // Analyze symptoms with weighted scoring
        for (const symptom of symptoms) {
            const symptomLower = symptom.toLowerCase();
            if (SYMPTOM_CONDITIONS[symptomLower]) {
                // Calculate symptom weight
                let weight = 1;
                if (SEVERE_SYMPTOMS.has(symptomLower)) weight = 3;
                if (SPECIFIC_SYMPTOMS.has(symptomLower)) weight = 2;
                
                symptomWeights.set(symptomLower, weight);
                
                SYMPTOM_CONDITIONS[symptomLower].forEach(condition => {
                    possibleConditions.add(condition);
                    // Increment score with weight
                    conditionScores.set(condition, (conditionScores.get(condition) || 0) + weight);
                });
            }
        }
        
        // Add conditions based on duration with weighted scoring
        if (duration === 'more_than_2_weeks') {
            possibleConditions.add('Chronic Condition');
            conditionScores.set('Chronic Condition', 1);
        }
        
        // Add conditions based on habits with weighted scoring
        if (habits.includes('smoking')) {
            possibleConditions.add('Respiratory Issues');
            conditionScores.set('Respiratory Issues', 1);
        }
        if (habits.includes('alcohol')) {
            possibleConditions.add('Liver Issues');
            conditionScores.set('Liver Issues', 1);
        }
        if (habits.includes('stress')) {
            possibleConditions.add('Anxiety');
            possibleConditions.add('High Blood Pressure');
            conditionScores.set('Anxiety', 1);
            conditionScores.set('High Blood Pressure', 1);
        }
        if (habits.includes('sleep')) {
            possibleConditions.add('Sleep Disorders');
            conditionScores.set('Sleep Disorders', 1);
        }
        if (habits.includes('diet')) {
            possibleConditions.add('Nutritional Deficiencies');
            conditionScores.set('Nutritional Deficiencies', 1);
        }

        // Sort conditions by relevance score and filter out low-scoring conditions
        const sortedConditions = Array.from(possibleConditions)
            .filter(condition => (conditionScores.get(condition) || 0) >= 1) // Only keep conditions with score >= 1
            .sort((a, b) => (conditionScores.get(b) || 0) - (conditionScores.get(a) || 0))
            .slice(0, 3); // Keep only top 3 most relevant conditions
        
        // If no conditions meet the threshold, show the top conditions anyway
        if (sortedConditions.length === 0 && possibleConditions.size > 0) {
            return {
                possible_conditions: Array.from(possibleConditions).slice(0, 3),
                primary_recommendations: ['Please provide more details about your symptoms for better analysis'],
                secondary_recommendations: [],
                severity: 'Low'
            };
        }
        
        // Generate recommendations based on top conditions
        const primaryRecommendations = new Set();
        const secondaryRecommendations = new Set();
        
        for (const condition of sortedConditions) {
            if (RECOMMENDATIONS[condition]) {
                // Add first 2 recommendations as primary
                RECOMMENDATIONS[condition].slice(0, 2).forEach(rec => primaryRecommendations.add(rec));
                // Add remaining as secondary
                RECOMMENDATIONS[condition].slice(2).forEach(rec => secondaryRecommendations.add(rec));
            }
        }
        
        // Add lifestyle recommendations based on habits and symptoms
        if (habits.includes('smoking')) {
            primaryRecommendations.add('Consider quitting smoking');
        }
        if (habits.includes('alcohol')) {
            primaryRecommendations.add('Limit alcohol consumption');
        }
        if (habits.includes('exercise')) {
            primaryRecommendations.add('Maintain your exercise routine');
        } else {
            primaryRecommendations.add('Start a regular exercise routine');
        }
        if (habits.includes('stress')) {
            primaryRecommendations.add('Practice stress management techniques');
        }
        if (habits.includes('sleep')) {
            primaryRecommendations.add('Improve sleep hygiene');
        }
        if (habits.includes('diet')) {
            primaryRecommendations.add('Adopt a balanced diet');
        }
        
        // Calculate severity based on symptoms and conditions
        let severityScore = 0;
        
        // Base severity from number of symptoms
        severityScore += symptoms.length * 5;
        
        // Add severity from severe symptoms
        symptoms.forEach(symptom => {
            if (SEVERE_SYMPTOMS.has(symptom.toLowerCase())) {
                severityScore += 20;
            } else if (SPECIFIC_SYMPTOMS.has(symptom.toLowerCase())) {
                severityScore += 10;
            }
        });
        
        // Add severity from duration
        switch(duration) {
            case 'less_than_day':
                severityScore += 5;
                break;
            case '1_3_days':
                severityScore += 10;
                break;
            case '4_7_days':
                severityScore += 15;
                break;
            case '1_2_weeks':
                severityScore += 20;
                break;
            case 'more_than_2_weeks':
                severityScore += 25;
                break;
        }
        
        // Add severity from habits
        if (habits.includes('smoking')) severityScore += 10;
        if (habits.includes('alcohol')) severityScore += 10;
        if (habits.includes('stress')) severityScore += 15;
        if (habits.includes('sleep')) severityScore += 15;
        if (habits.includes('diet')) severityScore += 10;
        
        // Normalize severity to 0-100
        severityScore = Math.min(100, severityScore);
        
        // Determine severity level
        let severityLevel;
        if (severityScore < 30) {
            severityLevel = 'Low';
        } else if (severityScore < 60) {
            severityLevel = 'Medium';
        } else {
            severityLevel = 'High';
        }
        
        return {
            possible_conditions: sortedConditions,
            primary_recommendations: Array.from(primaryRecommendations),
            secondary_recommendations: Array.from(secondaryRecommendations),
            severity: severityLevel,
            severityScore: severityScore
        };
    }

    function getSeverityText(severity, severityScore) {
        if (severity === 'Low') {
            return 'Mild - Monitor symptoms and follow recommendations';
        } else if (severity === 'Medium') {
            return 'Moderate - Consider consulting a healthcare provider';
        } else {
            return 'Severe - Seek medical attention as soon as possible';
        }
    }

    function displayResults(results) {
        const resultsContent = document.getElementById('results-content');
        const conditionsList = document.getElementById('conditions-list');
        const recommendationsList = document.getElementById('recommendations-list');
        const severityBar = document.getElementById('severity-bar');
        const severityText = document.getElementById('severity-text');
        const severityIndicator = document.querySelector('.severity-indicator');
        const gender = document.getElementById('gender').value;

        // Clear previous results
        conditionsList.innerHTML = '';
        recommendationsList.innerHTML = '';

        // Display conditions
        results.possible_conditions.forEach(condition => {
            const li = document.createElement('li');
            li.textContent = condition;
            conditionsList.appendChild(li);
        });

        // Display recommendations
        results.primary_recommendations.forEach(recommendation => {
            const li = document.createElement('li');
            li.textContent = recommendation;
            recommendationsList.appendChild(li);
        });

        // If female analysis exists, add it to the results
        if (results.femaleAnalysis) {
            const femaleSection = document.createElement('div');
            femaleSection.className = 'female-analysis-section';
            
            // Add normal symptoms
            if (results.femaleAnalysis.normalSymptoms.length > 0) {
                const normalHeader = document.createElement('h3');
                normalHeader.textContent = 'Normal Period Symptoms';
                femaleSection.appendChild(normalHeader);
                
                const normalList = document.createElement('ul');
                results.femaleAnalysis.normalSymptoms.forEach(symptom => {
                    const li = document.createElement('li');
                    li.textContent = `${symptom.symptom}: ${symptom.info}`;
                    normalList.appendChild(li);
                });
                femaleSection.appendChild(normalList);
            }

            // Add warning symptoms
            if (results.femaleAnalysis.warningSymptoms.length > 0) {
                const warningHeader = document.createElement('h3');
                warningHeader.textContent = 'Warning Signs';
                warningHeader.style.color = '#e74c3c';
                femaleSection.appendChild(warningHeader);
                
                const warningList = document.createElement('ul');
                results.femaleAnalysis.warningSymptoms.forEach(symptom => {
                    const li = document.createElement('li');
                    li.textContent = `${symptom.symptom}: ${symptom.info}`;
                    li.style.color = '#e74c3c';
                    warningList.appendChild(li);
                });
                femaleSection.appendChild(warningList);
            }

            // Add ML confidence if available
            if (results.mlAnalysis && results.mlAnalysis.confidence) {
                const confidenceHeader = document.createElement('h3');
                confidenceHeader.textContent = 'ML Analysis Confidence';
                femaleSection.appendChild(confidenceHeader);
                
                const confidenceText = document.createElement('p');
                confidenceText.textContent = `Confidence Level: ${results.mlAnalysis.confidence}`;
                femaleSection.appendChild(confidenceText);
            }

            resultsContent.appendChild(femaleSection);
        }

        // Update severity only for males
        if (gender === 'male') {
            severityIndicator.style.display = 'block';
            severityBar.style.width = `${results.severityScore}%`;
            severityText.textContent = getSeverityText(results.severity, results.severityScore);
        } else {
            severityIndicator.style.display = 'none';
        }

        // Show results
        resultsContent.style.display = 'block';
    }

    // Gender selection handler
    document.getElementById('gender').addEventListener('change', function() {
        const femaleSpecificSection = document.getElementById('female-specific');
        if (this.value === 'female') {
            femaleSpecificSection.style.display = 'block';
        } else {
            femaleSpecificSection.style.display = 'none';
        }
        // Clear all results
        clearResults();
    });

    // Menstrual cycle status handler
    document.getElementById('cycle-status').addEventListener('change', function() {
        // Clear all results
        clearResults();
    });

    // Function to clear all results
    function clearResults() {
        const resultsContent = document.getElementById('results-content');
        const conditionsList = document.getElementById('conditions-list');
        const recommendationsList = document.getElementById('recommendations-list');
        const severityBar = document.getElementById('severity-bar');
        const severityText = document.getElementById('severity-text');

        // Hide the results content
        resultsContent.style.display = 'none';
        
        // Clear all lists
        conditionsList.innerHTML = '';
        recommendationsList.innerHTML = '';
        
        // Reset severity
        severityBar.style.width = '0%';
        severityText.textContent = '';
        
        // Remove any female analysis section if it exists
        const femaleSection = resultsContent.querySelector('.female-analysis-section');
        if (femaleSection) {
            femaleSection.remove();
        }
    }

    // Function to get female-specific symptoms data
    function getFemaleSymptomsData() {
        const gender = document.getElementById('gender').value;
        if (gender !== 'female') return null;

        const isOnPeriod = document.getElementById('cycle-status').value === 'yes';
        const symptoms = {};
        
        // Get all checked female symptoms
        document.querySelectorAll('input[name="female_symptoms"]:checked').forEach(symptom => {
            symptoms[symptom.id] = {
                present: true,
                duringPeriod: isOnPeriod
            };
        });

        return symptoms;
    }

    // Function to analyze female-specific symptoms
    function analyzeFemaleSymptoms(symptoms, isOnPeriod) {
        const femaleSymptoms = {
            'lower back pain': {
                duringPeriod: {
                    normal: 'Normal during period',
                    warning: '⚠ If pain is severe or persistent',
                    conditions: ['Normal Menstrual Cramps']
                },
                outsidePeriod: {
                    warning: 'May indicate endometriosis',
                    severity: 'high',
                    conditions: ['Endometriosis']
                }
            },
            'cramps': {
                duringPeriod: {
                    normal: 'Normal during period',
                    warning: '⚠ If cramps are severe',
                    conditions: ['Normal Menstrual Cramps']
                },
                outsidePeriod: {
                    warning: 'May indicate ovarian cyst',
                    severity: 'medium',
                    conditions: ['Ovarian Cyst']
                }
            },
            'bloating': {
                duringPeriod: {
                    normal: 'Normal during period',
                    warning: '⚠ If bloating is severe',
                    conditions: ['Normal Period Symptoms']
                },
                outsidePeriod: {
                    warning: 'May indicate PCOS',
                    severity: 'medium',
                    conditions: ['PCOS']
                }
            },
            'breast tenderness': {
                duringPeriod: {
                    normal: 'Normal in PMS',
                    warning: '⚠ If tenderness is severe',
                    conditions: ['Normal PMS Symptoms']
                },
                outsidePeriod: {
                    warning: 'May indicate hormonal imbalance',
                    severity: 'medium',
                    conditions: ['Hormonal Imbalance']
                }
            },
            'fatigue': {
                duringPeriod: {
                    normal: 'Light fatigue is okay during period',
                    warning: '⚠ If fatigue is severe',
                    conditions: ['Normal Period Symptoms']
                },
                outsidePeriod: {
                    warning: 'May indicate anemia',
                    severity: 'high',
                    conditions: ['Anemia']
                }
            },
            'heavy bleeding': {
                duringPeriod: {
                    normal: 'May happen during period',
                    warning: '⚠ Monitor duration and flow',
                    conditions: ['Normal Period']
                },
                outsidePeriod: {
                    warning: 'Consult healthcare provider',
                    severity: 'high',
                    conditions: ['Uterine Fibroids']
                }
            },
            'mood swings': {
                duringPeriod: {
                    normal: 'Common in PMS',
                    warning: '⚠ If mood changes are severe',
                    conditions: ['Normal PMS Symptoms']
                },
                outsidePeriod: {
                    warning: 'May indicate hormonal imbalance',
                    severity: 'medium',
                    conditions: ['Hormonal Imbalance']
                }
            },
            'headaches': {
                duringPeriod: {
                    normal: 'Occasional headaches are normal',
                    warning: '⚠ If headaches are severe',
                    conditions: ['Normal Period Symptoms']
                },
                outsidePeriod: {
                    warning: 'May indicate migraine',
                    severity: 'medium',
                    conditions: ['Migraine']
                }
            },
            'nausea': {
                duringPeriod: {
                    normal: 'Sometimes occurs during period',
                    warning: '⚠ If nausea is severe',
                    conditions: ['Normal Period Symptoms']
                },
                outsidePeriod: {
                    warning: 'May indicate pregnancy',
                    severity: 'high',
                    conditions: ['Pregnancy']
                }
            },
            'acne': {
                duringPeriod: {
                    normal: 'Common in PMS',
                    warning: '⚠ If acne is severe',
                    conditions: ['Normal PMS Symptoms']
                },
                outsidePeriod: {
                    warning: 'May indicate PCOS',
                    severity: 'medium',
                    conditions: ['PCOS']
                }
            },
            'sleep disturbances': {
                duringPeriod: {
                    normal: 'Common in PMS',
                    warning: '⚠ If sleep issues are severe',
                    conditions: ['Normal PMS Symptoms']
                },
                outsidePeriod: {
                    warning: 'May indicate anxiety',
                    severity: 'medium',
                    conditions: ['Anxiety']
                }
            },
            'pelvic pain': {
                duringPeriod: {
                    normal: 'Mild cramps are common',
                    warning: '⚠ If pain is severe',
                    conditions: ['Normal Menstrual Cramps']
                },
                outsidePeriod: {
                    warning: 'May indicate endometriosis',
                    severity: 'high',
                    conditions: ['Endometriosis']
                }
            },
            'appetite changes': {
                duringPeriod: {
                    normal: 'Appetite can increase during period',
                    warning: '⚠ If changes are extreme',
                    conditions: ['Normal Period Symptoms']
                },
                outsidePeriod: {
                    warning: 'May indicate depression',
                    severity: 'medium',
                    conditions: ['Depression']
                }
            },
            'dizziness': {
                duringPeriod: {
                    normal: 'Mild dizziness is okay',
                    warning: '⚠ If dizziness is severe',
                    conditions: ['Normal Period Symptoms']
                },
                outsidePeriod: {
                    warning: 'May indicate anemia',
                    severity: 'high',
                    conditions: ['Anemia']
                }
            }
        };

        const results = {
            normalSymptoms: [],
            warningSymptoms: [],
            recommendations: [],
            conditions: new Set()
        };

        // Check each symptom
        symptoms.forEach(symptom => {
            const symptomLower = symptom.toLowerCase();
            
            if (femaleSymptoms[symptomLower]) {
                const symptomInfo = femaleSymptoms[symptomLower];
                
                if (isOnPeriod) {
                    // During period analysis
                    results.normalSymptoms.push({
                        symptom: symptom,
                        info: symptomInfo.duringPeriod.normal,
                        conditions: symptomInfo.duringPeriod.conditions
                    });
                    
                    if (symptomInfo.duringPeriod.warning) {
                        results.warningSymptoms.push({
                            symptom: symptom,
                            info: symptomInfo.duringPeriod.warning,
                            severity: 'medium'
                        });
                    }
                } else {
                    // Outside period analysis
                    results.warningSymptoms.push({
                        symptom: symptom,
                        info: symptomInfo.outsidePeriod.warning,
                        severity: symptomInfo.outsidePeriod.severity
                    });
                    
                    // Add specific conditions
                    if (symptomInfo.outsidePeriod.conditions) {
                        symptomInfo.outsidePeriod.conditions.forEach(condition => {
                            results.conditions.add(condition);
                        });
                    }
                }
            }
        });

        // Generate recommendations based on findings
        if (results.warningSymptoms.length > 0) {
            if (isOnPeriod) {
                results.recommendations.push('Monitor your symptoms. If they persist beyond your period, consult a healthcare provider.');
            } else {
                results.recommendations.push('Consider consulting a healthcare provider for further evaluation.');
            }
        }

        if (isOnPeriod && results.normalSymptoms.length > 0) {
            results.recommendations.push('Your symptoms appear to be normal for your menstrual cycle.');
        }

        // Convert Set to Array for conditions
        results.conditions = Array.from(results.conditions);

        return results;
    }

    // Modify the analyzeSymptoms function to prioritize female-specific analysis
    async function analyzeSymptoms() {
        const symptoms = document.getElementById('symptoms').value;
        const duration = document.getElementById('duration').value;
        const habits = getSelectedHabits();
        const gender = document.getElementById('gender').value;
        const isOnPeriod = gender === 'female' ? document.getElementById('cycle-status').value === 'yes' : false;

        // Show loading state
        document.getElementById('loading').style.display = 'block';
        document.getElementById('results-content').style.display = 'none';

        try {
            // Extract symptoms from text
            const extractedSymptoms = extractSymptoms(symptoms);
            
            let results;
            
            if (gender === 'female') {
                // For female users, use both ML and rule-based analysis
                const [mlResults, ruleResults] = await Promise.all([
                    analyzeWithML({
                        symptoms: extractedSymptoms,
                        duration,
                        habits
                    }),
                    analyzeFemaleSymptoms(extractedSymptoms, isOnPeriod)
                ]);

                // Combine ML and rule-based results
                const combinedConditions = new Set([
                    ...mlResults.possible_conditions,
                    ...ruleResults.conditions
                ]);

                // Combine recommendations
                const combinedRecommendations = [
                    ...mlResults.primary_recommendations,
                    ...ruleResults.recommendations
                ];

                // Determine severity based on both analyses
                const severity = mlResults.severity === 'high' || ruleResults.warningSymptoms.length > 0 ? 'high' : 'low';

                results = {
                    possible_conditions: Array.from(combinedConditions),
                    primary_recommendations: combinedRecommendations,
                    severity: severity,
                    femaleAnalysis: ruleResults,
                    mlAnalysis: mlResults
                };
            } else {
                // For male users, use the regular ML analysis
                results = await analyzeWithML({
                    symptoms: extractedSymptoms,
                    duration,
                    habits
                });
            }

            // Display results
            displayResults(results);
        } catch (error) {
            console.error('Analysis error:', error);
            alert('An error occurred during analysis. Please try again.');
        } finally {
            document.getElementById('loading').style.display = 'none';
        }
    }

    analyzeBtn.addEventListener('click', async () => {
        const inputText = symptomsInput.value.trim();
        const duration = durationSelect.value;
        const habits = Array.from(document.querySelectorAll('input[name="habits"]:checked')).map(cb => cb.id);
        const gender = document.getElementById('gender').value;
        const isOnPeriod = gender === 'female' ? document.getElementById('cycle-status').value === 'yes' : false;
        
        if (!inputText) {
            alert('Please describe your symptoms');
            return;
        }
        
        if (!duration) {
            alert('Please select how long you have been experiencing these symptoms');
            return;
        }

        // Show loading state
        loadingDiv.style.display = 'block';
        resultsContent.style.display = 'none';
        conditionsList.innerHTML = '';
        recommendationsList.innerHTML = '';

        try {
            // Extract symptoms from natural language input
            const extractedSymptoms = extractSymptoms(inputText);
            
            if (extractedSymptoms.length === 0) {
                alert('Could not identify specific symptoms. Please try describing your symptoms in more detail.');
                loadingDiv.style.display = 'none';
                return;
            }

            let results;

            if (gender === 'female') {
                // For female users, use female-specific analysis
                const femaleAnalysis = analyzeFemaleSymptoms(extractedSymptoms, isOnPeriod);
                results = {
                    possible_conditions: femaleAnalysis.conditions,
                    primary_recommendations: femaleAnalysis.recommendations,
                    severity: femaleAnalysis.warningSymptoms.length > 0 ? 'high' : 'low',
                    femaleAnalysis: femaleAnalysis
                };
            } else {
                // For male users, use rule-based analysis
                results = analyzeSymptomsRuleBased(extractedSymptoms, duration, habits);
            }

            // Display results
            displayResults(results);

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while analyzing symptoms. Please try again.');
        } finally {
            loadingDiv.style.display = 'none';
        }
    });
}); 