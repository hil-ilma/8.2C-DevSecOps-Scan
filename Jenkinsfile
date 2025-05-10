pipeline {
  agent any
  environment {
    NODE_ENV = 'test'
  }

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps { sh 'npm install' }
    }

    stage('Test & Coverage') {
  steps {
    // run tests
    sh 'npm test'

    // generate LCOV + console summary
    sh 'npx nyc --reporter=lcov --reporter=text-summary mocha --recursive'

    // emit the HTML report into coverage/
    sh 'npx nyc report --reporter=html'
    }
    post {
      always {
       // archive whatever is in coverage/
       archiveArtifacts artifacts: 'coverage/**', fingerprint: true
      }
     }
   }

    stage('Security Audit') {
      steps {
        sh 'npm audit --audit-level=moderate || true'
      }
    }

    stage('SonarQube Analysis') {
      when { expression { env.SONAR_TOKEN }}
      steps {
        withSonarQubeEnv('SonarCloud') {
          sh '''
            sonar-scanner \
              -Dsonar.organization=<YOUR_ORG> \
              -Dsonar.projectKey=<YOUR_ORG>_<YOUR_PROJECT> \
              -Dsonar.login=$SONAR_TOKEN
          '''
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'console.log', allowEmptyArchive: true
      // you can add an email or Slack notification here
    }
  }
}
