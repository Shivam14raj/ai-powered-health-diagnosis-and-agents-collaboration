class SymptomAnalyzer {
    constructor() {
        this.model = null;
        this.symptomEncoder = null;
        this.conditionEncoder = null;
        this.isModelLoaded = false;
        this.trainingHistory = [];
    }

    async initialize() {
        try {
            if (!window.tf) {
                throw new Error('TensorFlow.js not loaded');
            }

            // Create a more sophisticated neural network model
            this.model = window.tf.sequential();
            
            // Input layer with increased capacity
            this.model.add(window.tf.layers.dense({
                units: 512,
                activation: 'relu',
                inputShape: [150],
                kernelRegularizer: window.tf.regularizers.l2(0.01)
            }));
            
            this.model.add(window.tf.layers.dropout(0.4));
            
            // Hidden layers with increased capacity
            this.model.add(window.tf.layers.dense({
                units: 256,
                activation: 'relu',
                kernelRegularizer: window.tf.regularizers.l2(0.01)
            }));
            
            this.model.add(window.tf.layers.dropout(0.3));
            
            this.model.add(window.tf.layers.dense({
                units: 128,
                activation: 'relu',
                kernelRegularizer: window.tf.regularizers.l2(0.01)
            }));
            
            this.model.add(window.tf.layers.dropout(0.2));
            
            // Output layer with increased capacity for more conditions
            this.model.add(window.tf.layers.dense({
                units: 50,
                activation: 'softmax'
            }));

            // Compile the model with better optimizer settings
            this.model.compile({
                optimizer: window.tf.train.adam(0.0005),
                loss: 'categoricalCrossentropy',
                metrics: ['accuracy', 'precision', 'recall']
            });

            // Initialize symptom and condition encoders
            this.initializeEncoders();
            
            this.isModelLoaded = true;
            console.log('ML Model initialized successfully');
        } catch (error) {
            console.error('Error initializing ML model:', error);
            throw error;
        }
    }

    initializeEncoders() {
        // Enhanced symptom encoder with more detailed mappings
        this.symptomEncoder = {
            // Physical symptoms
            'fever': 0, 'headache': 1, 'cough': 2, 'fatigue': 3, 'nausea': 4,
            'dizziness': 5, 'chest pain': 6, 'shortness of breath': 7, 'muscle pain': 8,
            'sore throat': 9, 'stress': 10, 'anxiety': 11, 'depression': 12,
            'insomnia': 13, 'stomach pain': 14, 'diarrhea': 15, 'constipation': 16,
            'rash': 17, 'itching': 18, 'joint pain': 19, 'back pain': 20,
            'eye problems': 21, 'ear problems': 22, 'weight loss': 23, 'weight gain': 24,
            'memory problems': 25, 'tremors': 26, 'chills': 27, 'sweating': 28,
            'loss of appetite': 29, 'vomiting': 30, 'abdominal pain': 31, 'bloating': 32,
            'heartburn': 33, 'difficulty swallowing': 34, 'palpitations': 35, 'swelling': 36,
            'numbness': 37, 'tingling': 38, 'confusion': 39, 'mood changes': 40,
            'irritability': 41, 'difficulty concentrating': 42, 'sleep disturbances': 43,
            'night sweats': 44, 'muscle weakness': 45, 'balance problems': 46,
            'speech problems': 47, 'vision changes': 48, 'hearing problems': 49,
            'runny nose': 50, 'stuffy nose': 51, 'sneezing': 52, 'wheezing': 53,
            'chest tightness': 54, 'rapid heartbeat': 55, 'irregular heartbeat': 56,
            'arm pain': 57, 'leg pain': 58, 'neck pain': 59, 'shoulder pain': 60,
            'knee pain': 61, 'ankle pain': 62, 'wrist pain': 63, 'elbow pain': 64,
            'hip pain': 65, 'tooth pain': 66, 'jaw pain': 67, 'earache': 68,
            'throat pain': 69, 'abdominal cramps': 70, 'gas pain': 71, 'rectal pain': 72,
            'testicular pain': 73, 'pelvic pain': 74, 'vaginal pain': 75, 'penile pain': 76,
            'breast pain': 77, 'nipple pain': 78, 'skin pain': 79, 'bone pain': 80,
            'nerve pain': 81, 'burning sensation': 82, 'sharp pain': 85, 'dull pain': 86,
            'cramping': 87, 'spasms': 88, 'twitching': 89, 'seizures': 90,
            'fainting': 91, 'blackouts': 92, 'hallucinations': 93, 'delusions': 94,
            'paranoia': 95, 'mania': 96, 'obsessive thoughts': 97, 'compulsive behaviors': 98,
            'panic attacks': 99, 'eye strain': 100, 'neck pain': 101, 'back pain': 102,
            'fatigue': 104, 'anxiety': 105, 'depression': 106, 'insomnia': 107,
            'digestive issues': 108, 'weight gain': 109, 'weight loss': 110, 'muscle pain': 111,
            'joint pain': 112, 'poor concentration': 113, 'mood swings': 114, 'irritability': 115,
            'dehydration': 116, 'poor posture': 117, 'sedentary lifestyle': 118, 'irregular sleep': 119,
            'stress': 120, 'caffeine dependence': 121, 'screen time': 122, 'irregular meals': 123,
            'poor diet': 124, 'lower back pain': 125, 'cramps': 126, 'breast tenderness': 127,
            'heavy bleeding': 128, 'light bleeding': 129, 'irregular bleeding': 130, 'spotting': 131,
            'menstrual pain': 132, 'pms symptoms': 133, 'hormonal changes': 134, 'ovulation pain': 135,
            'vaginal discharge': 136, 'urinary frequency': 137, 'urinary urgency': 138,
            'urinary incontinence': 139, 'hot flashes': 140, 'vaginal dryness': 142, 'libido changes': 143,
            'fertility issues': 144, 'pregnancy symptoms': 145, 'postpartum symptoms': 146,
            'menopause symptoms': 147, 'perimenopause symptoms': 148, 'endometriosis symptoms': 149
        };

        // Enhanced condition encoder with more specific conditions
        this.conditionEncoder = [
            // Respiratory conditions
            'Common Cold', 'Flu', 'Bronchitis', 'Pneumonia', 'Asthma', 'COPD', 'Sinusitis',
            'Tonsillitis', 'Strep Throat', 'Tuberculosis', 'Lung Cancer', 'Pulmonary Embolism',
            
            // Neurological conditions
            'Migraine', 'Tension Headache', 'Cluster Headache', 'Meningitis', 'Encephalitis',
            'Brain Tumor', 'Stroke', 'Transient Ischemic Attack', 'Multiple Sclerosis',
            'Parkinson\'s Disease', 'Alzheimer\'s Disease', 'Dementia', 'Epilepsy',
            
            // Mental health conditions
            'Anxiety Disorder', 'Major Depressive Disorder', 'Bipolar Disorder', 'PTSD',
            'OCD', 'Panic Disorder', 'Social Anxiety Disorder', 'Generalized Anxiety Disorder',
            'Schizophrenia', 'Borderline Personality Disorder', 'ADHD', 'Autism Spectrum Disorder',
            
            // Digestive conditions
            'Gastritis', 'Gastroenteritis', 'Irritable Bowel Syndrome', 'Crohn\'s Disease',
            'Ulcerative Colitis', 'Celiac Disease', 'Gallbladder Disease', 'Pancreatitis',
            'Appendicitis', 'Diverticulitis', 'Colon Cancer', 'Stomach Cancer',
            
            // Cardiovascular conditions
            'Hypertension', 'Coronary Artery Disease', 'Heart Attack', 'Heart Failure',
            'Arrhythmia', 'Atrial Fibrillation', 'Peripheral Artery Disease', 'Deep Vein Thrombosis',
            'Varicose Veins', 'Aortic Aneurysm', 'Cardiomyopathy', 'Endocarditis',
            
            // Endocrine conditions
            'Diabetes Type 1', 'Diabetes Type 2', 'Hypothyroidism', 'Hyperthyroidism',
            'Addison\'s Disease', 'Cushing\'s Syndrome', 'Pituitary Disorders', 'Parathyroid Disorders',
            'Adrenal Disorders', 'Metabolic Syndrome', 'Polycystic Ovary Syndrome',
            
            // Musculoskeletal conditions
            'Osteoarthritis', 'Rheumatoid Arthritis', 'Gout', 'Fibromyalgia',
            'Osteoporosis', 'Scoliosis', 'Herniated Disc', 'Sciatica',
            'Carpal Tunnel Syndrome', 'Tendinitis', 'Bursitis', 'Lupus',
            
            // Skin conditions
            'Eczema', 'Psoriasis', 'Acne', 'Rosacea',
            'Contact Dermatitis', 'Urticaria', 'Shingles', 'Lupus',
            'Melanoma', 'Basal Cell Carcinoma', 'Squamous Cell Carcinoma', 'Vitiligo',
            
            // Additional conditions
            'Chronic Fatigue Syndrome', 'Lyme Disease', 'HIV/AIDS', 'Hepatitis',
            'Kidney Disease', 'Liver Disease', 'Anemia', 'Leukemia',
            'Lymphoma', 'Multiple Myeloma', 'Sickle Cell Disease', 'Hemophilia',
            
            // Female-specific conditions
            'Normal Menstrual Cycle',
            'Premenstrual Syndrome (PMS)',
            'Polycystic Ovary Syndrome (PCOS)',
            'Endometriosis',
            'Uterine Fibroids',
            'Ovarian Cysts',
            'Pelvic Inflammatory Disease (PID)',
            'Menopause',
            'Perimenopause',
            'Hormonal Imbalance',
            'Premature Ovarian Failure',
            'Primary Ovarian Insufficiency',
            'Vaginal Infections',
            'Urinary Tract Infection (UTI)',
            'Pelvic Floor Disorders',
            'Breast Conditions',
            'Cervical Conditions',
            'Ovarian Conditions',
            'Uterine Conditions',
            'Vaginal Conditions',
            'Menstrual Disorders',
            'Fertility Issues',
            'Pregnancy-Related Conditions',
            'Postpartum Conditions',
            'Menopausal Symptoms',
            'Hormonal Disorders',
            'Reproductive System Disorders',
            'Sexual Health Issues',
            'Gynecological Cancers',
            'Breast Cancer'
        ];
    }

    preprocessSymptoms(symptoms, habits = []) {
        try {
            // Create a zero vector of size 150 (increased for more symptoms and lifestyle factors)
            const symptomVector = new Array(150).fill(0);  
            
            // Convert symptoms to vector with weighted importance
            symptoms.forEach(symptom => {
                const index = this.symptomEncoder[symptom.toLowerCase()];
                if (index !== undefined) {
                    symptomVector[index] = 1;        
                }
            });

            // Add lifestyle factors to the vector
            habits.forEach(habit => {
                switch(habit) {   
                    case 'smoking':
                        symptomVector[100] = 1; // eye strain
                        symptomVector[103] = 1; // headache
                        symptomVector[104] = 1; // fatigue
                        break;
                    case 'alcohol':
                        symptomVector[104] = 1; // fatigue
                        symptomVector[108] = 1; // digestive issues
                        break;
                    case 'sedentary':
                        symptomVector[101] = 1; // neck pain
                        symptomVector[102] = 1; // back pain
                        symptomVector[111] = 1; // muscle pain
                        symptomVector[112] = 1; // joint pain
                        break;
                    case 'screen_time':
                        symptomVector[100] = 1; // eye strain
                        symptomVector[101] = 1; // neck pain
                        symptomVector[103] = 1; // headache
                        break;
                    case 'stress':
                        symptomVector[105] = 1; // anxiety
                        symptomVector[107] = 1; // insomnia
                        symptomVector[115] = 1; // irritability
                        break;
                    case 'sleep':
                        symptomVector[104] = 1; // fatigue
                        symptomVector[113] = 1; // poor concentration
                        symptomVector[114] = 1; // mood swings
                        break;
                    case 'caffeine':
                        symptomVector[107] = 1; // insomnia
                        symptomVector[105] = 1; // anxiety
                        break;
                    case 'irregular_meals':
                        symptomVector[108] = 1; // digestive issues
                        symptomVector[104] = 1; // fatigue
                        break;
                    case 'dehydration':
                        symptomVector[103] = 1; // headache
                        symptomVector[104] = 1; // fatigue
                        break;
                    case 'poor_posture':
                        symptomVector[101] = 1; // neck pain
                        symptomVector[102] = 1; // back pain
                        break;
                }
            });
            
            return window.tf.tensor2d([symptomVector]);
        } catch (error) {
            console.error('Error preprocessing symptoms:', error);
            throw error;
        }
    }

    async analyzeSymptoms(symptoms, habits = []) {
        if (!this.isModelLoaded) {
            throw new Error('Model not loaded');
        }

        try {
            // Preprocess symptoms with lifestyle factors
            const inputTensor = this.preprocessSymptoms(symptoms, habits);
            
            // Get predictions
            const predictions = await this.model.predict(inputTensor).data();
            
            // Get top 3 conditions with confidence scores
            const topConditions = this.getTopConditions(predictions, 3);
            
            // Clean up tensors
            inputTensor.dispose();
            
            // Filter out low confidence predictions
            const filteredConditions = topConditions.filter(condition => 
                condition.probability >= 0.3 // Only keep predictions with at least 30% confidence
            );
            
            return filteredConditions.length > 0 ? filteredConditions : topConditions;
        } catch (error) {
            console.error('Error analyzing symptoms:', error);
            throw error;
        }
    }

    getTopConditions(predictions, topK) {
        try {
            // Create array of [index, probability] pairs
            const indexedPredictions = predictions.map((prob, index) => [index, prob]);
            
            // Sort by probability in descending order
            indexedPredictions.sort((a, b) => b[1] - a[1]);
            
            // Get top K conditions with confidence scores
            return indexedPredictions.slice(0, topK).map(([index, prob]) => ({
                condition: this.conditionEncoder[index],
                probability: prob,
                confidence: this.getConfidenceLevel(prob)
            }));
        } catch (error) {
            console.error('Error getting top conditions:', error);
            throw error;
        }
    }

    getConfidenceLevel(probability) {
        if (probability >= 0.9) return 'Very High';
        if (probability >= 0.7) return 'High';
        if (probability >= 0.5) return 'Medium';
        if (probability >= 0.3) return 'Low';
        return 'Very Low';
    }

    async trainModel(trainingData) {
        if (!this.isModelLoaded) {
            throw new Error('Model not loaded');
        }

        try {
            const { symptoms, conditions } = trainingData;
            
            // Convert symptoms to tensors
            const inputTensor = this.preprocessSymptoms(symptoms);
            
            // Convert conditions to one-hot encoded tensors
            const outputTensor = window.tf.oneHot(
                window.tf.tensor1d(conditions.map(c => this.conditionEncoder.indexOf(c))),
                50
            );
            
            // Train the model with early stopping and validation
            const result = await this.model.fit(inputTensor, outputTensor, {
                epochs: 100,   // Increased epochs for better training
                batchSize: 32,
                validationSplit: 0.2,
                callbacks: {
                    onEpochEnd: (epoch, logs) => {
                        this.trainingHistory.push({
                            epoch: epoch + 1,
                            loss: logs.loss,    
                            accuracy: logs.acc,
                            valLoss: logs.val_loss,
                            valAccuracy: logs.val_acc
                        });
                        console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
                    },
                    onTrainEnd: () => {
                        console.log('Training completed');
                        this.saveModel();
                    }
                }
            });
            
            // Clean up tensors
            inputTensor.dispose();
            outputTensor.dispose();
            
            return result;
        } catch (error) {
            console.error('Error training model:', error);
            throw error;
        }
    }

    async saveModel() {
        try {
            // Save model to browser's local storage
            const modelJSON = this.model.toJSON();
            localStorage.setItem('symptomAnalyzerModel', JSON.stringify(modelJSON));
            console.log('Model saved successfully');
        } catch (error) {
            console.error('Error saving model:', error);
        }
    }

    async loadModel() {
        try {
            const savedModel = localStorage.getItem('symptomAnalyzerModel');
            if (savedModel) {
                const modelJSON = JSON.parse(savedModel);
                this.model = await window.tf.models.modelFromJSON(modelJSON);
                this.model.compile({
                    optimizer: window.tf.train.adam(0.0005),
                    loss: 'categoricalCrossentropy',
                    metrics: ['accuracy', 'precision', 'recall']
                });
                console.log('Model loaded successfully');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error loading model:', error);
            return false;
        }
    }

    getModelMetrics() {
        return {
            trainingHistory: this.trainingHistory,
            isModelLoaded: this.isModelLoaded
        };
    }
}

// Export the SymptomAnalyzer class
export default SymptomAnalyzer; 