pipeline {
  agent any

  environment {
    // so our app.js test‐stub activates and we never hit Mongo/MySQL
    NODE_ENV   = 'test'
    // your SonarCloud token stored as a “Secret text” credential in Jenkins
    SONAR_TOKEN = credentials('sonarcloud-token')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        // reliable CI install
        sh 'npm ci'
      }
    }

    stage('Test & Coverage') {
      steps {
        // run tests against the stubbed app
        sh 'npm test'

        // generate lcov + text summary
        sh 'npx nyc --reporter=lcov --reporter=text-summary mocha --recursive'

        // output HTML report under coverage/
        sh 'npx nyc report --reporter=html'
      }
      post {
        always {
          // archive the HTML, etc.
          archiveArtifacts artifacts: 'coverage/**', fingerprint: true
        }
      }
    }

    stage('Security Audit') {
      steps {
        // audit but never fail the job on medium or lower
        sh 'npm audit --audit-level=moderate || true'
      }
    }

    stage('SonarCloud Analysis') {
      when {
        expression { env.SONAR_TOKEN }
      }
      steps {
        // must have SonarCloud defined under “Configure System → SonarQube servers”
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

Coverage and audit results are under “Last Successful Artifacts.”
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
        to: 'hilmaazmy@gmail.com',
        attachLog: true,
        compressLog: true
      )
    }
  }
}
