pipeline {
  /* Use Node 18 LTS image so we have npm/node available */
  agent {
    docker {
      image 'node:18'
      args  '-u root'       // run as root so installs write to workspace
    }
  }

  /* Ensure our app sees TEST mode */
  environment {
    NODE_ENV = 'test'
  }

  /* Prevent the automatic "Declarative: Checkout SCM" stage */
  options {
    skipDefaultCheckout()
  }

  stages {
    stage('Checkout') {
      steps {
        /* explicit Git checkout */
        checkout scm
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Run Tests') {
      steps {
        /* our npm test uses cross-env and stubs DB/routers */
        sh 'npm test'
      }
    }

    stage('Coverage') {
      steps {
        sh 'npm run coverage'
      }
    }

    stage('Security Scan') {
      steps {
        /* audit won’t fail the build by default */
        sh 'npm audit || true'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'coverage/**,npm-debug.log', fingerprint: true
    }
  }
}
