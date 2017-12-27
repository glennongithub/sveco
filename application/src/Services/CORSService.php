<?php

/**
 * This file is part of the Sveco package.
 *
 *
 * @author Glenn Vinbladh (glenn@edgeweb.se)
 */

namespace App\Services;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class CORSService
 * Assisting with Cross Domain Origin Sharing Issues.
 */
class CORSService
{

    /**
     * Origins for CORS-requests that we will accept. Array of regex string that we will evaluate
     * @var string[]
     */
    protected $allowedOrigins;


    /**
     * CORSService constructor
     *
     * @param string[] $allowedOrigins  Array with regex string that will be tested against the Origin-header
     */
    public function __construct(array $allowedOrigins = ['/^(http|https):\/\/localhost(:[0-9]*)?$/', '/^(http|https):\/\/([a-zA-Z0-9_\-\.]*\.)?sveco\.(se|test|com|dev)$/'])
    {
        $this->allowedOrigins = $allowedOrigins;
    }

    /**
     * Validates HTTP_ORIGIN and add Access-Control- headers to the response so the client is allowed to make ajax requests to us.
     * See: https://en.wikipedia.org/wiki/Cross-origin_resource_sharing
     *
     * @param Request        $request           The request object
     * @param Response|null  $response          Optional response object
     *
     * @return Response
     */
    public function getResponseCORS(Request $request, Response $response = null)
    {
        // create a response if we didn't get one
        if ($response === null)
            $response = new Response();

        $origin = $request->server->get('HTTP_ORIGIN');

        // if we don't have a HTTP_ORIGIN header, it isn't a CORS request.
        if (!$origin)
            return $response;

        // test the list of origins
        $acceptableOrigin = false;
        foreach ($this->allowedOrigins as $originCandidate) {
            if (preg_match($originCandidate, $origin)) {
                $acceptableOrigin = true;
                break;
            }
        }

        // do we find the origin acceptable?
        if (!$acceptableOrigin)
            return $response;

        // we do! add the headers to the response.. :-)
        $response->headers->set('Access-Control-Allow-Origin', $origin);
        $response->headers->set('Access-Control-Allow-Methods', 'GET,POST');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }

}
