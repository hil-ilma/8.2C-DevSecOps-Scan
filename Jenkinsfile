 pipeline {
   agent any

   environment {
+    NODE_ENV   = 'test'
     SONAR_TOKEN = credentials('sonarcloud-token')
   }

   stages {
     stage('Checkout') { steps { checkout scm } }
     stage('Install')  { steps { sh 'npm ci' } }

     stage('Test & Coverage') {
+      /* because NODE_ENV=test is set globally,
         app.js will export the stubbed Express instance */
       steps {
         sh 'npm test'
         sh 'npx nyc --reporter=lcov --reporter=text-summary mocha --recursive'
         sh 'npx nyc report --reporter=html'
       }
       post {
         always { archiveArtifacts artifacts: 'coverage/**', fingerprint: true }
       }
     }

     stage('Security Audit') {
       steps { sh 'npm audit --audit-level=moderate || true' }
     }

     stage('SonarCloud Analysis') {
       when { expression { env.SONAR_TOKEN } }
       steps {
         withSonarQubeEnv('SonarCloud') {
           sh """
             npx sonar-scanner \
               -Dsonar.login=${env.SONAR_TOKEN} \
               -Dsonar.organization=hil-ilma \
               -Dsonar.projectKey=hil-ilma_8.2C-DevSecOps-Scan
           """
         }
       }
     }
   }

   post {
     success {
       emailext(
         subject: "${env.JOB_NAME} #${env.BUILD_NUMBER} succeeded",
         body: """\
 Build ${env.JOB_NAME} #${env.BUILD_NUMBER} succeeded!

 See console output at ${env.BUILD_URL}

 Coverage report and audit results are archived under “Last Successful Artifacts.”
 """,
         to: 'hilmaazmy@gmail.com',
         attachLog: true,
         compressLog: true
       )
     }
     failure {
       emailext(
         subject: "${env.JOB_NAME} #${env.BUILD_NUMBER} failed",
         body: "Build ${env.JOB_NAME} #${env.BUILD_NUMBER} failed.\nSee ${env.BUILD_URL}",
         to: 'your.email@domain.com',
         attachLog: true,
         compressLog: true
       )
     }
   }
 }
