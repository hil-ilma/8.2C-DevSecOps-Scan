pipeline {
  agent any
  tools {
    nodejs 'NodeJS-18'       // or whatever Node label you use
  }
  environment {
    SONAR_TOKEN = credentials('sonarcloud-token')
  }
  stages {
    // … your existing stages: Checkout, Install, Test, Coverage, Audit …

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
