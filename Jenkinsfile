pipeline {
  agent any
  tools {
    nodejs 'NodeJS-18'       // or whatever Node label you use
  }
  environment {
    SONAR_TOKEN = credentials('sonarcloud-token')
  }
  stages {
   stage('Checkout') {
      steps {
        // the one and only checkout
        checkout scm: [
          $class: 'GitSCM',
          branches: [[name: '*/main']],
          doGenerateSubmoduleConfigurations: false,
          extensions: [],
          userRemoteConfigs: [[
            url: 'https://github.com/hil-ilma/8.2C-DevSecOps-Scan.git',
            credentialsId: 'github-pat'
          ]]
        ]
      }
    }

    stage('Install Dependencies') {
      steps {
        // use npm install so the lockfile stays in sync
        sh 'npm install'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'npm test'
      }
    }

    stage('Coverage') {
      when {
        // only run if tests passed
        expression { currentBuild.currentResult == 'SUCCESS' }
      }
      steps {
        sh 'npm run coverage'
      }
    }

    stage('Security Scan') {
      when {
        expression { currentBuild.currentResult == 'SUCCESS' }
      }
      steps {
        // don’t fail the build on vulnerabilities, just report them
        sh 'npm audit --audit-level=moderate || true'
      }
    }
  }
    stage('SonarCloud Analysis') {
      steps {
        // this matches the “Name” you gave when configuring Sonar in Jenkins
        withSonarQubeEnv('SonarCloud') {
          // invoke the scanner
          sh 'npx sonar-scanner -Dsonar.login=${SONAR_TOKEN}'
        }
      }
    }

    stage('Quality Gate') {
      steps {
        // give SonarCloud a minute to compute
        timeout(time: 1, unit: 'MINUTES') {
          waitForQualityGate abortPipeline: true
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'coverage/**', allowEmptyArchive: true
    }
  }
}
