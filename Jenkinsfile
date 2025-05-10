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
        sh 'npm test'
        sh 'nyc --reporter=lcov --reporter=text-summary mocha --recursive'
        sh 'nyc report --reporter=html'
      }
      post {
        always {
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
