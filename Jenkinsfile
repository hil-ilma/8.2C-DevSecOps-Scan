pipeline {
  agent any

  tools { 
    nodejs 'NodeJS-16' 
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test'
      }
    }

    stage('Coverage') {
      steps {
        sh 'npx nyc --reporter=lcov --reporter=text-summary mocha --recursive'
        archiveArtifacts artifacts: 'coverage/**', fingerprint: true
      }
    }

    
  }

  post {
    success {
      emailext(
        to:       'hilmaazmy@gmail.com',
        subject:  "Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body:     """<p>Your build passed!</p>
                    <p>See details at: <a href="${env.BUILD_URL}">${env.BUILD_URL}console</a></p>""",
        attachLog: true
      )
    }
    failure {
      emailext(
        to:       'hilmaazmy@gmail.com',
        subject:  "Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body:     """<p>Oops—your build failed.</p>
                    <p>Console output: <a href="${env.BUILD_URL}">${env.BUILD_URL}console</a></p>""",
        attachLog: true
      )
    }
  }
}
