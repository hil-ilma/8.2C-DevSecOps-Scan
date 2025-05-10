pipeline {
  agent any

  environment {
    // pulls your SonarCloud token from Jenkins credentials
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
        // in CI it's best to use `npm ci`
        sh 'npm ci'
      }
    }

    stage('Test & Coverage') {
      steps {
        // run your Mocha test suite
        sh 'npm test'

        // generate lcov + console summary
        sh 'npx nyc --reporter=lcov --reporter=text-summary mocha --recursive'

        // output a browsable HTML report under coverage/
        sh 'npx nyc report --reporter=html'
      }
      post {
        always {
          // archive everything in coverage/
          archiveArtifacts artifacts: 'coverage/**', fingerprint: true
        }
      }
    }

    stage('Security Audit') {
      steps {
        // audit uses exit code 1 for any vuln ≥ moderate unless you `|| true`
        sh 'npm audit --audit-level=moderate || true'
      }
    }

    stage('SonarCloud Analysis') {
      when {
        expression { return env.SONAR_TOKEN }
      }
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

Coverage report and audit results are archived under “Last Successful Artifacts” on the build page.
""",
        to: 'your.email@domain.com',
        attachLog: true,
        compressLog: true
      )
    }
    failure {
      emailext(
        subject: "${env.JOB_NAME} #${env.BUILD_NUMBER} failed",
        body: """\
Build ${env.JOB_NAME} #${env.BUILD_NUMBER} failed.
See console output at ${env.BUILD_URL}
""",
        to: 'your.email@domain.com',
        attachLog: true,
        compressLog: true
      )
    }
  }
}
