pipeline {
  agent any

  // only declare this if you actually need ENV vars
  environment {
    // pull your SonarCloud token from Jenkins credentials
    SONAR_TOKEN = credentials('sonarcloud-token')
    NODE_ENV    = 'test'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm install'
      }
    }

    stage('Test & Coverage') {
      steps {
        // run your tests
        sh 'npm test'
        // generate coverage report
        sh 'npm run coverage'
      }
      post {
        always {
          // grab the coverage output directory if you want
          archiveArtifacts artifacts: 'coverage/**', fingerprint: true
        }
      }
    }

    stage('Security Audit') {
      steps {
        sh 'npm audit --audit-level=moderate || true'
      }
      post {
        always {
          // archive the npm-audit report if you want
          archiveArtifacts artifacts: 'npm-audit-report.json', allowEmptyArchive: true
        }
      }
    }

    stage('SonarQube Analysis') {
      when {
        expression { return env.SONAR_TOKEN != null }
      }
      steps {
        withSonarQubeEnv('SonarCloud') {
          sh 'sonar-scanner \
                -Dsonar.organization=<your-org> \
                -Dsonar.projectKey=<your-org>_<your-project> \
                -Dsonar.login=$SONAR_TOKEN'
        }
      }
    }
  }

  post {
    always {
      // archive full console log
      archiveArtifacts artifacts: 'console.log', allowEmptyArchive: true
      // send email, Slack, etc. here
    }
  }
}
