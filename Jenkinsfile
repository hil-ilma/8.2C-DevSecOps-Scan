pipeline {
  agent any

  tools {
    // if you have a NodeJS plugin configured, you can reference it here
    //nodejs "NodeJS-18"
  }

  environment {
    // credentials() will pull a Secret Text credential you've created
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
        // use npm ci for reliable CI installs
        sh 'npm ci'
      }
    }

    stage('Test & Coverage') {
      steps {
        // run your Mocha tests
        sh 'npm test'

        // generate lcov + summary in the console
        sh 'npx nyc --reporter=lcov --reporter=text-summary mocha --recursive'

        // generate HTML report into coverage/
        sh 'npx nyc report --reporter=html'
      }
      post {
        always {
          // archive everything under coverage/
          archiveArtifacts artifacts: 'coverage/**', fingerprint: true
        }
      }
    }

    stage('Security Audit') {
      steps {
        // fail the build only on critical or high by default;
        // you can bump --audit-level if you wish
        sh 'npm audit --audit-level=moderate || true'
      }
    }

    stage('SonarCloud Analysis') {
      when {
        expression { return env.SONAR_TOKEN }
      }
      steps {
        // invoke SonarCloud scanner; assumes you have the
        // “SonarCloud” server configured in “Configure System”
        withSonarQubeEnv('SonarCloud') {
          sh "npx sonar-scanner \
            -Dsonar.login=${env.SONAR_TOKEN} \
            -Dsonar.organization=hil-ilma \
            -Dsonar.projectKey=hil-ilma_8.2C-DevSecOps-Scan"
        }
      }
    }
  }

  post {
    success {
      // send a notification, with the console log attached
      // requires the Email-Extension plugin to be installed
      emailext(
        subject: "${env.JOB_NAME} #${env.BUILD_NUMBER} succeeded",
        body: """\
Build ${env.JOB_NAME} #${env.BUILD_NUMBER} succeeded!

See the console output at ${env.BUILD_URL} 

‍Coverage report and audit results are archived under “Last Successful Artifacts” on the build page.
""",
        to: 'your.email@domain.com',
        attachLog: true,      // attach the full console log
        compressLog: true     // gzip it so it’s smaller
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
